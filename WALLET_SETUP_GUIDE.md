# 🔐 Freighter Wallet Setup Guide for AidLoop

This guide will help you connect your Freighter wallet to the AidLoop testnet application.

---

## 📥 Step 1: Install Freighter

### Browser Extension
Freighter is available for Chrome, Firefox, Brave, and Edge.

**Install Link:** https://freighter.app/

1. Visit the Freighter website
2. Click "Add to Browser"
3. Follow the installation prompts
4. Pin the extension to your browser toolbar for easy access

---

## 🔑 Step 2: Set Up Your Wallet

### Option A: Create New Wallet (Recommended for Testing)

1. Click the Freighter extension icon
2. Select "Create New Wallet"
3. Write down your 12-word recovery phrase (IMPORTANT!)
4. Confirm your recovery phrase
5. Create a password

### Option B: Import Existing Wallet

1. Click the Freighter extension icon
2. Select "Import Wallet"
3. Enter your 12-word recovery phrase
4. Create a password

### Option C: Import with Secret Key (For Your Test Account)

1. Click the Freighter extension icon
2. Select "Import Wallet"
3. Choose "Import via secret key"
4. Paste: `SD6V3FF6OEC5V53O5AAHLIA2JQMLPW5DWWXX4C5IIASUYL6XLNIR3GAZ`
5. Create a password

**This will import the deployer account with address:**
`GAEFBBEVPIUUOTKWOL7B3L6X46F5HYFY5E2IUDV2EUA3LOO6C5AJVB35`

---

## 🌐 Step 3: Switch to Testnet

**CRITICAL:** AidLoop contracts are deployed on **Stellar Testnet**, not mainnet!

1. Open Freighter extension
2. Click the hamburger menu (☰) in top right
3. Select "Settings"
4. Click "Network"
5. Select **"Test Net"**
6. Close settings

**Verify:** The Freighter extension should now show "Test Net" at the bottom.

---

## 💰 Step 4: Fund Your Account (If Needed)

If you created a new wallet, you'll need testnet XLM for transaction fees:

### Method 1: Stellar Laboratory (Recommended)

1. Visit: https://laboratory.stellar.org/#account-creator?network=test
2. Paste your Freighter address
3. Click "Create Account"
4. Wait for confirmation

### Method 2: Freighter Built-in Friendbot

1. Open Freighter
2. Click "Fund with Friendbot" (if available)
3. Confirm the transaction

### Method 3: Manual Friendbot Request

```bash
curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS_HERE"
```

Replace `YOUR_ADDRESS_HERE` with your actual Freighter address.

---

## 🔗 Step 5: Connect to AidLoop

1. Open AidLoop at http://localhost:5173
2. Click "Connect Freighter" button in top right
3. Freighter will open a popup
4. Review the connection request
5. Click "Connect" to approve

**Success!** You should now see your address in the navigation bar.

---

## ❓ Troubleshooting

### Problem: "Connect Freighter" Button Does Nothing

**Solution:**
1. Make sure Freighter extension is installed
2. Refresh the page
3. Check that Freighter is unlocked (enter password if needed)
4. Try clicking the button again

### Problem: Freighter Not Detected

**Possible Causes:**
- Freighter extension not installed
- Extension disabled in browser
- Using private/incognito mode (some browsers block extensions)

**Solutions:**
1. Install Freighter from https://freighter.app/
2. Enable the extension in your browser settings
3. Use a regular browser window (not incognito)
4. Restart your browser after installation

### Problem: Connection Popup Doesn't Appear

**Solutions:**
1. Check if popup was blocked by browser
2. Look for popup blocker icon in address bar
3. Allow popups for localhost
4. Unlock Freighter by entering your password
5. Refresh the page and try again

### Problem: Wrong Network Error

**Solution:**
1. Open Freighter
2. Go to Settings → Network
3. Select "Test Net"
4. Disconnect and reconnect in AidLoop

### Problem: Transaction Fails with "Sequence Number" Error

**Solution:**
1. Your account might not be funded yet
2. Get testnet XLM from Friendbot (see Step 4)
3. Make sure you have at least 1 XLM for fees

### Problem: "Account Not Found"

**Solution:**
Your account needs to be created on testnet first:
1. Visit https://laboratory.stellar.org/#account-creator?network=test
2. Enter your address and create the account
3. Return to AidLoop and try again

---

## 🧪 Testing the Connection

### Verify Connection

After connecting, you should see:
- ✅ Your address in the navigation bar (truncated)
- ✅ "Disconnect" button instead of "Connect Freighter"
- ✅ Access to Donor Dashboard, Beneficiary App, Merchant POS

### Test a Transaction

1. Navigate to **Donor Dashboard**
2. Check your XLM balance is displayed
3. Try adding USDC trustline:
   - Click "Add USDC Trustline"
   - Freighter popup should open
   - Review and approve the transaction
   - Wait for confirmation

**Success!** If this works, Freighter is properly connected.

---

## 🔒 Security Best Practices

### For Testing (Testnet)
- ✅ OK to use generated test accounts
- ✅ OK to share testnet addresses
- ✅ OK to import test secret keys
- ❌ Never use mainnet funds for testing

### For Production (Mainnet)
- ❌ NEVER share your secret key
- ❌ NEVER share your recovery phrase
- ✅ Always verify URLs before connecting
- ✅ Keep backups of recovery phrase offline
- ✅ Use strong passwords
- ✅ Enable 2FA when available

---

## 📱 Mobile Support

Freighter is currently desktop-only. For mobile testing:

1. **Use Stellar Laboratory:** Direct transaction signing
2. **Use Albedo:** Mobile-friendly wallet
3. **Wait for Freighter mobile:** Coming soon

---

## 🔄 Switching Accounts

To use multiple accounts in Freighter:

1. Open Freighter
2. Click account name at top
3. Click "+" to add new account
4. Choose:
   - Create new account
   - Import with secret key
   - Connect hardware wallet
5. Switch between accounts by clicking account name

---

## 📊 Monitoring Transactions

### In Freighter
1. Open extension
2. Click "Activity" tab
3. View all your transactions

### On Stellar Expert
1. Visit: https://stellar.expert/explorer/testnet
2. Enter your address in search
3. View detailed transaction history

### In AidLoop
- Transaction status shown after each action
- Links to Stellar Expert for details

---

## 🆘 Getting Help

### Freighter Issues
- Documentation: https://docs.freighter.app/
- Discord: https://discord.gg/stellar
- GitHub: https://github.com/stellar/freighter

### AidLoop Issues
- Check console for errors (F12 → Console tab)
- Verify network is "Test Net"
- Ensure account is funded
- Try disconnecting and reconnecting

---

## ✅ Connection Checklist

Before using AidLoop, verify:

- [ ] Freighter extension installed
- [ ] Wallet created/imported
- [ ] Network set to "Test Net"
- [ ] Account funded with XLM (at least 1 XLM)
- [ ] Wallet unlocked (not showing password screen)
- [ ] Freighter connected to AidLoop
- [ ] Address showing in navigation bar

**All checked?** You're ready to use AidLoop! 🎉

---

## 🎓 Next Steps

Once connected:

1. **As Donor:**
   - Go to Donor Dashboard
   - Add USDC trustline
   - Get testnet USDC from Stellar Laboratory
   - Deposit to Impact Vault

2. **As Beneficiary:**
   - Go to Beneficiary App
   - Browse available programs
   - View your vouchers

3. **As Merchant:**
   - Go to Merchant POS
   - Check verification status
   - Process voucher redemptions

---

## 📚 Additional Resources

- **Stellar Testnet:** https://www.stellar.org/developers/guides/get-started/create-account.html
- **Freighter Docs:** https://docs.freighter.app/
- **Stellar Laboratory:** https://laboratory.stellar.org/
- **Stellar Expert:** https://stellar.expert/
- **Stellar Discord:** https://discord.gg/stellar

---

## 🔄 Quick Reference Commands

### Get Testnet XLM
```bash
curl "https://friendbot.stellar.org?addr=YOUR_ADDRESS"
```

### Check Account Balance
```bash
curl "https://horizon-testnet.stellar.org/accounts/YOUR_ADDRESS"
```

### View Contract on Explorer
```
https://stellar.expert/explorer/testnet/contract/CONTRACT_ID
```

---

**Happy Testing!** 🚀

If you encounter any issues not covered here, check the browser console (F12) for detailed error messages.


