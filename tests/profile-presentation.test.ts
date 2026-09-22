import assert from "node:assert/strict";
import test from "node:test";
import { profileInitials } from "@/auth/profile-presentation";

test("profile initials come from the enrolled display name", () => {
  assert.equal(profileInitials("Riley Morgan"), "RM");
  assert.equal(profileInitials("  Riley   Morgan  "), "RM");
  assert.equal(profileInitials("Riley"), "RI");
  assert.equal(profileInitials("李 雷"), "李雷");
  assert.equal(profileInitials("  "), "?");
});
