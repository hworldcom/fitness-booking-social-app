"use client";

import { Wallet } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  useConnect,
  useConnectedWallet,
  useDisconnect,
  useIsWalletReady,
  useWalletStatus,
  useWallets,
} from "@solana/kit-plugin-wallet/react";
import { Pill } from "@/components/ui";
import { PHANTOM_DOWNLOAD_URL, walletClient } from "./wallet-client";
import {
  shortenWalletAddress,
  walletErrorMessage,
} from "./wallet-presentation";

const subscribeToHydration = () => () => {};

export function WalletStatusButton({ onOpen }: { onOpen: () => void }) {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const connected = useConnectedWallet(walletClient);
  const isReady = useIsWalletReady(walletClient);
  const status = useWalletStatus(walletClient);
  const address = mounted ? connected?.account.address : undefined;
  const isConnecting = status === "connecting";
  const isBusy =
    !mounted || !isReady || isConnecting || status === "disconnecting";

  const visibleLabel = address
    ? shortenWalletAddress(address)
    : isConnecting
      ? "Connecting…"
      : isBusy
        ? "Wallet loading"
        : "Connect Phantom";

  return (
    <button
      type="button"
      className={`wallet-button ${address ? "connected" : ""}`}
      aria-label={
        address
          ? `Phantom wallet connected: ${address}`
          : isConnecting
            ? "Phantom wallet connection is waiting for approval"
            : isBusy
              ? "Phantom wallet state is loading"
              : "Connect Phantom wallet"
      }
      disabled={isBusy}
      onClick={onOpen}
    >
      <Wallet size={17} aria-hidden="true" />
      <span>{visibleLabel}</span>
    </button>
  );
}

export function WalletConnectionPanel({ onSignIn }: { onSignIn?: () => void }) {
  const wallets = useWallets(walletClient);
  const connected = useConnectedWallet(walletClient);
  const isReady = useIsWalletReady(walletClient);
  const status = useWalletStatus(walletClient);
  const connect = useConnect(walletClient);
  const disconnect = useDisconnect(walletClient);
  const phantom = wallets[0];
  const address = connected?.account.address;
  const error = walletErrorMessage(connect.error ?? disconnect.error);

  if (!isReady) {
    return (
      <div className="wallet-state" role="status" aria-live="polite">
        <div className="wallet-illustration">
          <Wallet size={38} strokeWidth={1.2} aria-hidden="true" />
          <Pill tone="lime">Devnet only</Pill>
        </div>
        <strong>Checking for Phantom…</strong>
        <p>Waiting for wallet discovery and any saved connection to settle.</p>
      </div>
    );
  }

  if (address) {
    return (
      <div className="wallet-state">
        <div className="wallet-illustration">
          <Wallet size={38} strokeWidth={1.2} aria-hidden="true" />
          <Pill tone="lime">Connected</Pill>
        </div>
        <div className="wallet-address" role="status" aria-live="polite">
          <span>Phantom</span>
          <strong>{shortenWalletAddress(address)}</strong>
          <code>{address}</code>
        </div>
        <div className="wallet-context" aria-label="Wallet context">
          <Pill>External wallet</Pill>
          <Pill>Solana Devnet</Pill>
          <Pill>Test funds</Pill>
        </div>
        <div className="notice">
          <strong>Wallet connected. MovX Club signed out.</strong>
          <p>
            This connection shares only your public address. Sign-in is a
            separate, fee-free message approval; payments always require their
            own transaction approval.
          </p>
        </div>
        {error && (
          <p className="wallet-error" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          className="button secondary full"
          disabled={disconnect.isRunning || status === "disconnecting"}
          onClick={() => disconnect.dispatch()}
        >
          {disconnect.isRunning || status === "disconnecting"
            ? "Disconnecting…"
            : "Disconnect Phantom"}
        </button>
        <Link href="/sign-in" className="button dark full" onClick={onSignIn}>
          Continue to MovX Club sign-in
        </Link>
      </div>
    );
  }

  return (
    <div className="wallet-state">
      <div className="wallet-illustration">
        <Wallet size={38} strokeWidth={1.2} aria-hidden="true" />
        <Pill tone="lime">Devnet only</Pill>
      </div>
      <p className="dialog-copy">
        Connect the prepared Phantom wallet to expose its public Solana address.
        Connecting does not sign you in or request a message or transaction
        signature.
      </p>
      {phantom ? (
        <>
          <div className="notice">
            <strong>Phantom detected.</strong>
            <p>
              Review the origin and selected account in Phantom before approving
              the connection.
            </p>
          </div>
          {error && (
            <p className="wallet-error" role="alert">
              {error}
            </p>
          )}
          <button
            type="button"
            className="button dark full"
            disabled={connect.isRunning || status === "connecting"}
            onClick={() => connect.dispatch(phantom)}
          >
            {connect.isRunning || status === "connecting"
              ? "Waiting for Phantom…"
              : "Connect Phantom"}
          </button>
        </>
      ) : (
        <>
          <div className="notice">
            <strong>Phantom was not detected.</strong>
            <p>
              For the hackathon demo, install and unlock Phantom in desktop
              Chrome, then reload this page. Public browsing still works without
              a wallet.
            </p>
          </div>
          <a
            className="button dark full"
            href={PHANTOM_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
          >
            Get Phantom from the official site
          </a>
        </>
      )}
      <p className="wallet-safety">
        Never enter a recovery phrase or private key on this website.
      </p>
    </div>
  );
}
