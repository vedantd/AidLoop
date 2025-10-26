# 🔧 AidLoop Troubleshooting Guide

Quick solutions to common issues when using AidLoop.

---

## 🔌 Wallet Connection Issues

### ❌ Freighter Not Detected

**Symptoms:**
- "Connect Freighter" button shows error
- Red banner appears saying wallet not detected
- Console shows "Freighter not detected"

**Solutions:**

1. **Install Freighter:**
   ```
   Visit: https://freighter.app/
   Install the browser extension
   Restart your browser
   ```

2. **Enable Extension:**
   - Chrome: `chrome://extensions/`
   - Firefox: `about:addons`
   - Ensure Freighter is enabled
   - Try toggling it off/on

3. **Check Extension Permissions:**
   - Right-click Freighter icon
   - Manage extension
   - Ensure "Site access" is set to "On all sites" or "On click"

4. **Browser Compatibility:**
   - Use Chrome, Firefox, Brave, or Edge
   - Avoid Safari (not supported)
   - Disable other Stellar wallet extensions temporarily

5. **Clear Cache:**
   ```bash
   Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   Or clear browser cache completely
   ```

---

### ❌ Connection Popup Blocked

**Symptoms:**
- Click "Connect Freighter" but nothing happens
- No Freighter popup appears

**Solutions:**

1. **Check Popup Blocker:**
   - Look for blocked popup icon in address bar
   - Click it and allow popups from localhost
   - Try connecting again

2. **Unlock Freighter:**
   - Click Freighter extension
   - Enter your password
   - Try connecting again

3. **Refresh Page:**
   - F5 or Cmd+R
   - Try connecting again

---

### ❌ Wrong Network Error

**Symptoms:**
- Transactions fail with network mismatch
- Contract not found errors

**Solutions:**

1. **Switch to Testnet:**
   ```
   Open Freighter → Settings → Network → Select "Test Net"
   ```

2. **Verify Network:**
   - Freighter should show "Test Net" at bottom
   - NOT "Public Net" or "Main Net"

3. **Reconnect:**
   - Disconnect wallet in AidLoop
   - Connect again

---

## 💸 Transaction Failures

### ❌ Insufficient Balance

**Symptoms:**
- Transaction fails immediately
- Error: "insufficient balance"
- Can't send transactions

**Solutions:**

1. **Fund Your Account:**
   ```bash
   # Visit Friendbot
   curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS"
   
   # Or use Stellar Laboratory
   https://laboratory.stellar.org/#account-creator?network=test
   ```

2. **Check Balance:**
   - Donor Dashboard shows your XLM balance
   - Need at least 1 XLM for fees
   - Need 0.5 XLM reserve per trustline

3. **Get More XLM:**
   - Testnet XLM is free
   - Use Friendbot multiple times if needed
   - Each request gives ~10,000 XLM

---

### ❌ Account Not Found

**Symptoms:**
- Error: "Account does not exist"
- Can't load account from horizon

**Solutions:**

1. **Create Account on Testnet:**
   ```
   Visit: https://laboratory.stellar.org/#account-creator?network=test
   Paste your address
   Click "Create Account"
   ```

2. **Wait for Confirmation:**
   - Account creation takes 5-10 seconds
   - Refresh page after creation

---

### ❌ USDC Trustline Issues

**Symptoms:**
- "You need to add USDC trustline first"
- USDC balance shows 0 even after deposit

**Solutions:**

1. **Add Trustline:**
   - Go to Donor Dashboard
   - Click "Add USDC Trustline"
   - Approve in Freighter
   - Wait for confirmation

2. **Verify Trustline:**
   ```
   Check on Stellar Expert:
   https://stellar.expert/explorer/testnet/account/YOUR_ADDRESS
   
   Look for USDC in "Balances" section
   ```

3. **Get Testnet USDC:**
   - After trustline is added
   - Use Stellar Laboratory to send testnet USDC
   - Or use testnet USDC faucet if available

---

### ❌ Transaction Timeout

**Symptoms:**
- Transaction stuck on "Submitting..."
- Never completes or fails

**Solutions:**

1. **Check Network:**
   - Testnet might be slow during high traffic
   - Wait 30-60 seconds
   - Don't submit multiple times

2. **Retry:**
   - Refresh page
   - Try transaction again
   - Check Stellar Expert for transaction status

3. **Increase Timeout:**
   - This is a testnet issue, not AidLoop
   - Usually resolves itself

---

## 🖥️ Frontend Issues

### ❌ Page Won't Load

**Symptoms:**
- Blank screen
- 404 errors
- "Cannot GET /" error

**Solutions:**

1. **Start Dev Server:**
   ```bash
   cd /Users/vedantdalvi/AidLoop
   npm run dev
   ```

2. **Check Port:**
   - Default: http://localhost:5173
   - If 5173 is busy, Vite will use next available port
   - Check terminal output for actual port

3. **Kill Existing Process:**
   ```bash
   # If port is already in use
   lsof -ti:5173 | xargs kill -9
   npm run dev
   ```

---

### ❌ Hot Reload Not Working

**Symptoms:**
- Make code changes but page doesn't update
- Have to refresh manually

**Solutions:**

1. **Hard Refresh:**
   - Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

2. **Restart Dev Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Clear Vite Cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

---

### ❌ Styling Issues / Tailwind Not Working

**Symptoms:**
- No styles applied
- Plain HTML with no colors

**Solutions:**

1. **Rebuild:**
   ```bash
   npm run dev
   ```

2. **Check Tailwind Config:**
   - Verify `tailwind.config.js` exists
   - Verify `postcss.config.js` exists

3. **Purge CSS:**
   ```bash
   rm -rf node_modules/.vite
   npm install
   npm run dev
   ```

---

## 🔗 Contract Interaction Issues

### ❌ Contract Not Found

**Symptoms:**
- Error: "Contract does not exist"
- Transaction fails to invoke contract

**Solutions:**

1. **Verify Contract Addresses:**
   - Check `src/contracts/config.ts`
   - Addresses should match `deployed_contracts.json`

2. **Check Network:**
   - Contracts are on **testnet** only
   - Make sure Freighter is on testnet

3. **Verify Deployment:**
   ```
   Check on Stellar Expert:
   https://stellar.expert/explorer/testnet/contract/CONTRACT_ID
   ```

---

### ❌ Contract Function Fails

**Symptoms:**
- Transaction submits but contract function fails
- Error in transaction result

**Solutions:**

1. **Check Parameters:**
   - Contract might expect different parameter types
   - Review contract source code

2. **Initialize Contract:**
   - Some contracts need initialization first
   - Check if `initialize()` was called

3. **Check Permissions:**
   - Some functions require admin access
   - Make sure you're using the deployer account

---

## 📱 Browser-Specific Issues

### Chrome

**Issue:** Extension not loading
**Fix:**
```
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Reload" on Freighter
```

### Firefox

**Issue:** Freighter not appearing in toolbar
**Fix:**
```
1. Right-click toolbar
2. Select "Customize Toolbar"
3. Drag Freighter to toolbar
```

### Brave

**Issue:** Extension blocked by Shields
**Fix:**
```
1. Click Brave Shields icon
2. Turn off "Shields" for localhost
3. Refresh page
```

---

## 🐛 Console Errors Reference

### `Failed to fetch`
**Cause:** Network/RPC issue
**Fix:** Check internet, verify testnet RPC is online

### `Sequence number mismatch`
**Cause:** Transaction submitted twice
**Fix:** Refresh page, try again

### `tx_bad_seq`
**Cause:** Account sequence out of sync
**Fix:** Reload balances, wait a moment, retry

### `op_malformed`
**Cause:** Invalid operation parameters
**Fix:** Check transaction parameters

### `tx_insufficient_balance`
**Cause:** Not enough XLM
**Fix:** Fund account with Friendbot

### `op_no_trust`
**Cause:** Missing trustline
**Fix:** Add trustline before transferring assets

---

## 🔍 Debugging Tips

### 1. Open Browser Console

```
Windows/Linux: F12 or Ctrl+Shift+I
Mac: Cmd+Option+I
```

Look for error messages in red.

### 2. Check Network Tab

```
F12 → Network tab
Filter by "Fetch/XHR"
Look for failed requests (red)
Click to see error details
```

### 3. Check Freighter Console

```
Open Freighter
Click menu → Settings → Developer
Enable "Debug mode"
Check console for Freighter-specific errors
```

### 4. Verify Environment

```typescript
// Add to any page
console.log({
  freighterDetected: !!window.freighterApi,
  network: window.freighterApi ? 'available' : 'not available'
});
```

### 5. Test Contract Directly

```bash
# Test contract outside of frontend
stellar contract invoke \
  --id CONTRACT_ADDRESS \
  --source deployer \
  --network testnet \
  -- function_name --param value
```

---

## 🆘 Still Stuck?

### Check These Resources:

1. **AidLoop Documentation:**
   - `PROJECT_STATUS.md`
   - `WALLET_SETUP_GUIDE.md`
   - `FRONTEND_README.md`

2. **Stellar Resources:**
   - Stellar Discord: https://discord.gg/stellar
   - Stellar Docs: https://developers.stellar.org
   - Soroban Docs: https://soroban.stellar.org

3. **Freighter Resources:**
   - Freighter Docs: https://docs.freighter.app
   - Freighter GitHub: https://github.com/stellar/freighter

### Report an Issue:

```
1. Open browser console (F12)
2. Copy any error messages
3. Note what you were trying to do
4. Note your browser and OS
5. Provide transaction hash if available
6. Share in Stellar Discord #soroban channel
```

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Freighter installed and enabled
- [ ] On Testnet (not mainnet)
- [ ] Account funded with XLM
- [ ] Frontend running (`npm run dev`)
- [ ] Browser console checked for errors
- [ ] Tried refreshing page
- [ ] Tried disconnecting and reconnecting wallet
- [ ] Contract addresses match deployed ones

---

## 🎯 Common Resolution Steps

**90% of issues can be fixed by:**

1. **Refresh the page** (F5)
2. **Disconnect and reconnect** wallet
3. **Switch to testnet** in Freighter
4. **Fund your account** with Friendbot
5. **Restart dev server** (Ctrl+C, then `npm run dev`)

Try these first! 🚀


