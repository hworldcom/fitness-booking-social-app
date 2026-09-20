"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { Check, KeyRound, LogOut, ShieldCheck, Wallet } from "lucide-react";
import {
  useConnect,
  useConnectedWallet,
  useIsWalletReady,
  useWalletStatus,
  useWallets,
} from "@solana/kit-plugin-wallet/react";
import { Pill } from "@/components/ui";
import {
  isCanonicalSignInLocation,
  supabasePublicConfig,
  WEB3_SIGN_IN_STATEMENT,
} from "@/auth/config";
import { walletSessionRelationship } from "@/auth/contracts";
import { authenticationErrorMessage } from "@/auth/presentation";
import { WalletAccountChangedError } from "@/auth/wallet-adapter";
import { solanaAddressFromWeb3Identities } from "@/auth/web3-identity";
import { browserAuthClient } from "@/auth/client/browser-client";
import { phantomAuthWallet } from "@/auth/client/phantom-wallet";
import { useAuthSession } from "@/auth/client/session-provider";
import {
  PHANTOM_DOWNLOAD_URL,
  walletClient,
} from "@/solana/client/wallet-client";
import {
  shortenWalletAddress,
  walletErrorMessage,
} from "@/solana/client/wallet-presentation";

const subscribeToHydration = () => () => {};

export function SignInScreen() {
  const router = useRouter();
  const { session, refreshSession } = useAuthSession();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const wallets = useWallets(walletClient);
  const connected = useConnectedWallet(walletClient);
  const walletReady = useIsWalletReady(walletClient);
  const walletStatus = useWalletStatus(walletClient);
  const connect = useConnect(walletClient);
  const [activeAction, setActiveAction] = useState<
    "sign-in" | "sign-out" | null
  >(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const actionLock = useRef(false);
  const config = supabasePublicConfig();
  const address = mounted ? (connected?.account.address ?? null) : null;
  const relationship = walletSessionRelationship(session, address);
  const connectError = walletErrorMessage(connect.error);
  const phantom = wallets[0];
  const canonicalLocation =
    mounted && config
      ? isCanonicalSignInLocation(config, window.location)
      : false;

  async function signIn() {
    if (actionLock.current || !address || !config || !canonicalLocation) return;

    const client = browserAuthClient();
    if (!client) return;

    actionLock.current = true;
    setActiveAction("sign-in");
    setActionError(null);

    try {
      const result = await client.auth.signInWithWeb3({
        chain: "solana",
        statement: WEB3_SIGN_IN_STATEMENT,
        wallet: phantomAuthWallet(address),
        options: { url: config.signInUrl },
      });

      if (result.error) throw result.error;
      if (
        walletClient.wallet.getState().connected?.account.address !== address
      ) {
        await client.auth.signOut({ scope: "local" });
        throw new WalletAccountChangedError();
      }

      const authenticatedAddress = solanaAddressFromWeb3Identities(
        result.data.user.identities,
      );
      if (authenticatedAddress !== address) {
        await client.auth.signOut({ scope: "local" });
        throw new Error(
          "The verified signature identity does not match the selected account.",
        );
      }

      const verified = await refreshSession();
      if (
        verified.status === "signed-in" &&
        verified.walletAddress !== address
      ) {
        await client.auth.signOut({ scope: "local" });
        await refreshSession();
        throw new Error(
          "The verified session does not match the selected account.",
        );
      }
      if (verified.status !== "signed-in") {
        throw new Error("The server verification service is unavailable.");
      }

      router.refresh();
    } catch (error) {
      setActionError(authenticationErrorMessage(error));
    } finally {
      actionLock.current = false;
      setActiveAction(null);
    }
  }

  async function signOut() {
    if (actionLock.current) return;

    const client = browserAuthClient();
    if (!client) return;

    actionLock.current = true;
    setActiveAction("sign-out");
    setActionError(null);

    try {
      const result = await client.auth.signOut({ scope: "local" });
      if (result.error) throw result.error;
      await refreshSession();
      router.refresh();
    } catch (error) {
      setActionError(authenticationErrorMessage(error));
    } finally {
      actionLock.current = false;
      setActiveAction(null);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-heading">
        <div>
          <span className="eyebrow">RepX Club identity</span>
          <h1>Sign in with your prepared Phantom wallet.</h1>
          <p>
            Connecting shares an address. Signing this login message separately
            proves that you control it and creates your RepX Club session.
          </p>
        </div>
        <Pill tone="lime">Message only · No transaction</Pill>
      </div>

      <div className="auth-layout">
        <div className="auth-card">
          <div className="auth-card-title">
            <ShieldCheck size={22} aria-hidden="true" />
            <div>
              <span>Application session</span>
              <h2>RepX Club sign-in</h2>
            </div>
          </div>

          {session.status === "disabled" && (
            <div className="auth-notice warning" role="status">
              <strong>Local authentication is not configured.</strong>
              <p>
                Add the three public Supabase values from{" "}
                <code>.env.example</code>
                and start the local Auth stack. Public discovery remains
                available.
              </p>
            </div>
          )}

          {session.status === "unavailable" && (
            <div className="auth-notice warning" role="alert">
              <strong>Sign-in status could not be verified.</strong>
              <p>
                The Auth service may be offline or the session may be invalid.
                No authenticated state is being assumed.
              </p>
              <button
                type="button"
                className="text-button"
                onClick={() => void refreshSession()}
              >
                Check again
              </button>
              {config && (
                <button
                  type="button"
                  className="text-button auth-clear-session"
                  disabled={activeAction !== null}
                  onClick={() => void signOut()}
                >
                  {activeAction === "sign-out"
                    ? "Clearing local session…"
                    : "Clear local session on this device"}
                </button>
              )}
            </div>
          )}

          {session.status === "signed-out" && (
            <div className="auth-notice neutral" role="status">
              <strong>RepX Club signed out.</strong>
              <p>
                A wallet connection by itself does not grant a profile,
                membership, role or purchase permission.
              </p>
            </div>
          )}

          {session.status === "signed-in" && relationship === "matched" && (
            <div className="auth-notice success" role="status">
              <strong>Signed in and wallet matched.</strong>
              <p>
                The server verified the session for{" "}
                {shortenWalletAddress(session.walletAddress)}. Application
                enrollment is still a separate later step.
              </p>
            </div>
          )}

          {session.status === "signed-in" &&
            relationship === "wallet-disconnected" && (
              <div className="auth-notice warning" role="alert">
                <strong>Session active; Phantom disconnected.</strong>
                <p>
                  You are still signed in as{" "}
                  {shortenWalletAddress(session.walletAddress)}. Reconnect that
                  wallet or sign out before wallet-bound actions.
                </p>
              </div>
            )}

          {session.status === "signed-in" &&
            relationship === "wallet-mismatch" && (
              <div className="auth-notice danger" role="alert">
                <strong>Connected wallet does not match this session.</strong>
                <p>
                  RepX Club is signed in as{" "}
                  {shortenWalletAddress(session.walletAddress)}, while Phantom
                  has{" "}
                  {address ? shortenWalletAddress(address) : "another account"}{" "}
                  selected. Sign out before authenticating the new account;
                  identities are never merged automatically.
                </p>
              </div>
            )}

          {!mounted || !walletReady ? (
            <div className="auth-wallet-row" role="status">
              <Wallet size={20} aria-hidden="true" />
              <span>Checking the Phantom connection…</span>
            </div>
          ) : address ? (
            <div className="auth-wallet-details">
              <span>Connected Phantom account</span>
              <strong>{shortenWalletAddress(address)}</strong>
              <code>{address}</code>
            </div>
          ) : (
            <div className="auth-connect">
              <p>Connect Phantom before asking it to sign the login message.</p>
              {phantom ? (
                <button
                  type="button"
                  className="button secondary full"
                  disabled={
                    connect.isRunning ||
                    walletStatus === "connecting" ||
                    activeAction !== null
                  }
                  onClick={() => connect.dispatch(phantom)}
                >
                  <Wallet size={17} aria-hidden="true" />
                  {connect.isRunning || walletStatus === "connecting"
                    ? "Waiting for Phantom…"
                    : "Connect Phantom"}
                </button>
              ) : (
                <a
                  className="button secondary full"
                  href={PHANTOM_DOWNLOAD_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get Phantom from the official site
                </a>
              )}
            </div>
          )}

          {connectError && (
            <p className="wallet-error" role="alert">
              {connectError}
            </p>
          )}
          {config && mounted && !canonicalLocation && (
            <div className="auth-notice danger" role="alert">
              <strong>Use the configured sign-in address.</strong>
              <p>
                Wallet proof is disabled on this origin. Open {config.signInUrl}
                exactly so Phantom and Supabase verify the same application URI.
              </p>
            </div>
          )}
          {actionError && (
            <p className="wallet-error" role="alert">
              {actionError}
            </p>
          )}

          {session.status === "signed-out" && address && config && (
            <button
              type="button"
              className="button dark full"
              disabled={activeAction !== null || !canonicalLocation}
              onClick={() => void signIn()}
            >
              <KeyRound size={17} aria-hidden="true" />
              {activeAction === "sign-in"
                ? "Waiting for message approval…"
                : "Review and sign login message"}
            </button>
          )}

          {session.status === "signed-in" && (
            <button
              type="button"
              className="button secondary full"
              disabled={activeAction !== null}
              onClick={() => void signOut()}
            >
              <LogOut size={17} aria-hidden="true" />
              {activeAction === "sign-out"
                ? "Signing out…"
                : "Sign out on this device"}
            </button>
          )}

          <p className="wallet-safety">
            RepX Club never asks for your recovery phrase or private key.
          </p>
        </div>

        <aside className="auth-explainer" aria-label="How wallet sign-in works">
          <h2>Three separate steps</h2>
          <ol>
            <li>
              <span>
                <Wallet size={17} aria-hidden="true" />
              </span>
              <div>
                <strong>Connect</strong>
                <p>Phantom shares the selected public address.</p>
              </div>
            </li>
            <li>
              <span>
                <KeyRound size={17} aria-hidden="true" />
              </span>
              <div>
                <strong>Authenticate</strong>
                <p>You approve a readable, fee-free login message.</p>
              </div>
            </li>
            <li>
              <span>
                <Check size={17} aria-hidden="true" />
              </span>
              <div>
                <strong>Use RepX Club</strong>
                <p>
                  Supabase holds the application session. Purchases still need a
                  separate, explicit transaction approval later.
                </p>
              </div>
            </li>
          </ol>
          <div className="notice">
            <strong>The signed statement</strong>
            <p>{WEB3_SIGN_IN_STATEMENT}</p>
          </div>
          <Link href="/explore" className="text-link">
            Continue browsing without signing in
          </Link>
        </aside>
      </div>
    </section>
  );
}
