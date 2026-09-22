"use client";

import { Building2, Wallet } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useSignMessage,
  useWalletStatus,
  useWallets,
} from "@solana/kit-plugin-wallet/react";
import { useAuthSession } from "@/auth/client/session-provider";
import { Pill } from "@/components/ui";
import type {
  ClubWalletMutationResult,
  ClubWalletSnapshot,
} from "../club-wallet";
import { walletSignatureToBase64 } from "../personal-wallet";
import {
  fetchClubWallet,
  requestClubWalletChallenge,
  revokeClubWallet,
  submitClubWalletProof,
} from "./club-wallet-client";
import { PHANTOM_DOWNLOAD_URL, walletClient } from "./wallet-client";
import {
  shortenWalletAddress,
  walletErrorMessage,
  walletProofErrorMessage,
} from "./wallet-presentation";

const subscribeToHydration = () => () => {};

export function ClubWalletAuthorityGuard() {
  const { session } = useAuthSession();
  const connected = useConnectedWallet(walletClient);
  const isReady = useIsWalletReady(walletClient);
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const checkedContext = useRef<string | null>(null);
  const sessionKey = session.status === "signed-in" ? session.subject : null;
  const address = mounted ? connected?.account.address : undefined;

  useEffect(() => {
    if (!mounted || !isReady || !sessionKey) {
      checkedContext.current = null;
      return;
    }

    const contextKey = `${sessionKey}:${address ?? "disconnected"}`;
    if (checkedContext.current === contextKey) return;
    checkedContext.current = contextKey;
    let active = true;

    void fetchClubWallet().then(async (snapshot) => {
      if (
        active &&
        snapshot.status === "authorized" &&
        snapshot.club.wallet.address !== address
      ) {
        await revokeClubWallet();
      }
    });

    return () => {
      active = false;
    };
  }, [address, isReady, mounted, sessionKey]);

  return null;
}

export function ClubWalletAuthorityPanel({
  snapshot,
  onSnapshot,
}: {
  snapshot: Extract<ClubWalletSnapshot, { status: "eligible" | "authorized" }>;
  onSnapshot: (snapshot: ClubWalletSnapshot) => void;
}) {
  const wallets = useWallets(walletClient);
  const connected = useConnectedWallet(walletClient);
  const isReady = useIsWalletReady(walletClient);
  const status = useWalletStatus(walletClient);
  const connect = useConnect(walletClient);
  const disconnect = useDisconnect(walletClient);
  const signMessage = useSignMessage(walletClient);
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const phantom = wallets[0];
  const address = mounted ? connected?.account.address : undefined;
  const [activeAction, setActiveAction] = useState<
    "authorize" | "disconnect" | "leave" | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const actionLock = useRef(false);
  const mismatchRevocation = useRef(false);
  const connectionError = walletErrorMessage(connect.error ?? disconnect.error);
  const matchesClubWallet = address === snapshot.club.wallet.address;

  const handleMutationResult = useCallback(
    (result: ClubWalletMutationResult) => {
      if (result.status === "authorized" || result.status === "eligible") {
        onSnapshot(result);
        setActionError(null);
        return;
      }
      if (result.status === "invalid-proof") {
        setActionError(
          "The club-wallet message could not be verified or was already used. Request a new message and try again.",
        );
      } else if (result.status === "conflict") {
        setActionError(
          "The selected account does not match the prepared club wallet, or the club authority changed. No authority was granted.",
        );
      } else if (result.status === "no-club-access") {
        setActionError(
          "This account no longer has active primary-administrator access to the prepared club.",
        );
        onSnapshot({ status: "no-club-access" });
      } else if (result.status === "signed-out") {
        setActionError(
          "Your email session ended. Sign in again to manage a club.",
        );
      } else if (result.status === "forbidden") {
        setActionError("The server could not verify your application profile.");
      } else if (result.status === "invalid-request") {
        setActionError("The club-wallet request was not accepted. Try again.");
      } else {
        setActionError(
          "Club-wallet authority is unavailable. No authority was granted; try again shortly.",
        );
      }
    },
    [onSnapshot],
  );

  useEffect(() => {
    if (
      !mounted ||
      !isReady ||
      snapshot.status !== "authorized" ||
      matchesClubWallet ||
      mismatchRevocation.current
    ) {
      return;
    }
    mismatchRevocation.current = true;
    void revokeClubWallet()
      .then((result) => {
        if (result.status === "revoked" || result.status === "no-authority") {
          onSnapshot({ status: "eligible", club: snapshot.club });
          setActionError(
            address
              ? "Club authority ended because the connected Phantom account changed."
              : "Club authority ended because Phantom disconnected.",
          );
        } else {
          handleMutationResult(result);
        }
      })
      .finally(() => {
        mismatchRevocation.current = false;
      });
  }, [
    address,
    handleMutationResult,
    isReady,
    matchesClubWallet,
    mounted,
    onSnapshot,
    snapshot,
  ]);

  async function authorizeClubWallet() {
    if (actionLock.current || !matchesClubWallet || !address) return;
    actionLock.current = true;
    setActiveAction("authorize");
    setActionError(null);
    try {
      const challenge = await requestClubWalletChallenge(address);
      if (challenge.status !== "challenge") {
        handleMutationResult(challenge);
        return;
      }
      const signature = await signMessage.dispatchAsync(
        new TextEncoder().encode(challenge.challenge.message),
      );
      handleMutationResult(
        await submitClubWalletProof({
          challengeId: challenge.challenge.id,
          walletAddress: challenge.challenge.address,
          message: challenge.challenge.message,
          signature: walletSignatureToBase64(signature),
        }),
      );
    } catch (error) {
      setActionError(walletProofErrorMessage(error));
    } finally {
      actionLock.current = false;
      setActiveAction(null);
    }
  }

  async function leaveClubAuthority(alsoDisconnect: boolean) {
    if (actionLock.current) return;
    actionLock.current = true;
    setActiveAction(alsoDisconnect ? "disconnect" : "leave");
    setActionError(null);
    try {
      const result = await revokeClubWallet();
      if (result.status !== "revoked" && result.status !== "no-authority") {
        handleMutationResult(result);
        return;
      }
      onSnapshot({ status: "eligible", club: snapshot.club });
      if (alsoDisconnect && address) await disconnect.dispatchAsync();
    } finally {
      actionLock.current = false;
      setActiveAction(null);
    }
  }

  return (
    <div className="wallet-state">
      <div className="wallet-illustration">
        <Building2 size={38} strokeWidth={1.2} aria-hidden="true" />
        <Pill tone={snapshot.status === "authorized" ? "lime" : "amber"}>
          {snapshot.status === "authorized" ? "Authorized" : "Club wallet"}
        </Pill>
      </div>
      <div className="wallet-address" role="status" aria-live="polite">
        <span>{snapshot.club.name}</span>
        <strong>{shortenWalletAddress(snapshot.club.wallet.address)}</strong>
        <code>{snapshot.club.wallet.address}</code>
      </div>
      <div className="wallet-context" aria-label="Club wallet context">
        <Pill>Personal email session</Pill>
        <Pill>Club authority</Pill>
        <Pill>Solana Devnet · Test funds</Pill>
      </div>

      {snapshot.status === "authorized" && matchesClubWallet ? (
        <div className="notice success">
          <strong>Club wallet authorized.</strong>
          <p>
            You remain signed in as yourself and may act for{" "}
            {snapshot.club.name} until{" "}
            {new Date(snapshot.authority.expiresAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            . This proof does not authorize a payment or transaction.
          </p>
        </div>
      ) : address && !matchesClubWallet ? (
        <div className="notice">
          <strong>The connected account is not the club wallet.</strong>
          <p>
            Disconnect {shortenWalletAddress(address)}, then connect the
            prepared {snapshot.club.name} wallet. Personal wallets cannot
            substitute for club authority.
          </p>
        </div>
      ) : !address ? (
        <div className="notice">
          <strong>Connect the prepared club wallet.</strong>
          <p>
            Your email account identifies the administrator. A separate readable
            message proves control of the club wallet for at most ten minutes.
          </p>
        </div>
      ) : (
        <div className="notice">
          <strong>Club wallet connected, but not authorized.</strong>
          <p>
            Approve one readable authority message. Phantom will not be asked
            for a transaction signature and no funds move.
          </p>
        </div>
      )}

      {snapshot.status === "authorized" && matchesClubWallet ? (
        <>
          <button
            type="button"
            className="button secondary full"
            disabled={activeAction !== null}
            onClick={() => void leaveClubAuthority(false)}
          >
            {activeAction === "leave"
              ? "Ending authority…"
              : "Leave club wallet"}
          </button>
          <button
            type="button"
            className="button secondary full"
            disabled={activeAction !== null}
            onClick={() => void leaveClubAuthority(true)}
          >
            {activeAction === "disconnect"
              ? "Disconnecting…"
              : "End authority and disconnect Phantom"}
          </button>
        </>
      ) : matchesClubWallet ? (
        <button
          type="button"
          className="button dark full"
          disabled={activeAction !== null}
          onClick={() => void authorizeClubWallet()}
        >
          {activeAction === "authorize"
            ? "Waiting for club-wallet proof…"
            : `Authorize ${snapshot.club.name} wallet`}
        </button>
      ) : address ? (
        <button
          type="button"
          className="button secondary full"
          disabled={disconnect.isRunning || status === "disconnecting"}
          onClick={() => disconnect.dispatch()}
        >
          Disconnect this Phantom account
        </button>
      ) : phantom ? (
        <button
          type="button"
          className="button dark full"
          disabled={connect.isRunning || status === "connecting"}
          onClick={() => connect.dispatch(phantom)}
        >
          {connect.isRunning || status === "connecting"
            ? "Waiting for Phantom…"
            : "Connect club wallet"}
        </button>
      ) : (
        <a
          className="button dark full"
          href={PHANTOM_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
        >
          Get Phantom from the official site
        </a>
      )}

      {(actionError || connectionError) && (
        <p className="wallet-error" role="alert">
          {actionError ?? connectionError}
        </p>
      )}
      <p className="wallet-safety">
        <Wallet size={14} aria-hidden="true" /> Never enter a recovery phrase or
        private key on this website.
      </p>
    </div>
  );
}
