# Mobile Testing Guide

## Setup

### Prerequisites
- Expo CLI installed: `npm install -g expo-cli`
- Expo Go app installed on iOS or Android device
- Your device on same WiFi as computer

### Start Expo Dev Server
```bash
npx expo start
```

You'll see:
```
Local:   http://192.168.x.x:8081
LAN:     http://192.168.x.x:8081  (use this one for mobile)
```

### Connect Mobile Device

**iOS:**
1. Open Expo Go app on iPhone
2. Tap "Scan QR Code" 
3. Scan the QR code from terminal
4. Wait for app to bundle and load (first time ~30 sec)

**Android:**
1. Open Expo Go app
2. Tap home icon
3. Tap "Scan QR code"
4. Scan the QR code from terminal
5. Wait for app to bundle (first time ~30 sec)

---

## Complete Test Flow

### Phase 1: Authentication Flow (CRITICAL)

#### Test 1.1: Initial Load Should Show Login Screen
1. Open app for first time (or after complete logout)
2. **Expected:** Should see login screen, NOT home screen
3. **Check Logs:** Look for `[AUTH] Starting session check...` and `[AUTH] Token expired or invalid, clearing session`

#### Test 1.2: Signup
1. Tap "Criar Conta" button
2. Enter test data:
   - Name: `Teste Mobile`
   - Email: `teste@mobile.com`
   - Password: `teste123`
3. Tap "Cadastrar"
4. **Expected:** Navigate to login screen OR show success message
5. **Check Logs:** 
   - `[AUTH] Signup successful`
   - `[STORAGE]` operations should show platform type (Web/Native)

#### Test 1.3: Login with Valid Credentials
1. Enter credentials from Test 1.2
2. Tap "Entrar"
3. **Expected:** Should navigate to home screen (tabs)
4. **Check Logs:**
   - `[AUTH] Login attempt for: teste@mobile.com`
   - `[AUTH] Credentials valid, saving session for: teste@mobile.com`
   - `[SECURE] Saving token with 7-day expiry`
   - `[SECURE] Saving user ID: [UUID]`
   - `[STORAGE] Native: saved "app_auth_token" to SecureStore` (on mobile)
   - `[STORAGE] Native: saved "app_user_id" to SecureStore` (on mobile)

#### Test 1.4: Session Persistence
1. Kill app (swipe up on iOS, tap back multiple times on Android)
2. Reopen Expo Go and scan QR again
3. **Expected:** Should load directly to home screen, NOT login
4. **Check Logs:**
   - `[AUTH] Starting session check...`
   - `[AUTH] Token valid: true`
   - `[AUTH] User found! Setting user state: teste@mobile.com`
   - `[STORAGE] Native: retrieved "app_auth_token" from SecureStore`
   - `[STORAGE] Native: retrieved "app_user_id" from SecureStore`

#### Test 1.5: Storage Type Verification
1. Check console logs for every storage operation
2. **Expected on iOS/Android:** Should see `[STORAGE] Native: ...to SecureStore`
3. **NOT Expected:** Should NOT see `Fallback: ...to localStorage` (unless SecureStore fails intentionally)
4. **Note:** If you see `Fallback: ...localStorage`, SecureStore isn't working and we need to debug

---

### Phase 2: Cart & Order Flow

#### Test 2.1: Add to Cart
1. Go to "Explorar" tab
2. Find menu items
3. Tap "+" button to add to cart
4. **Expected:** Item appears in cart
5. **Check Logs:** Should see cart state updates

#### Test 2.2: View Cart
1. Go to "Carrinho" tab
2. Should show items you added
3. Check quantities and prices
4. **Expected:** All items from Test 2.1 visible

#### Test 2.3: Confirm Order
1. From cart screen, tap "Confirmar Pedido"
2. **Expected:** Navigate to "Pedido" (order) screen
3. **Check Logs:**
   - `[ORDER] Completing order...`
   - `[ORDER] Order created: [UUID]`
   - Navigation should work smoothly

#### Test 2.4: Order Appears on Order Screen
1. After Test 2.3, should land on "Pedido" tab
2. **Expected:** See the order you just created with items and total
3. **Check Logs:**
   - Should show currentOrder being set
   - Order details visible immediately

#### Test 2.5: Multiple Orders
1. Add different items to cart
2. Confirm order again
3. Go back to cart, repeat
4. Check "Pedido" tab - should show latest order
5. Check "Histórico" tab - should show all previous orders
6. **Expected:** All orders visible with correct timestamps

---

### Phase 3: Logout Flow

#### Test 3.1: Logout
1. Go to "Perfil" tab
2. Tap "Sair" (logout) button
3. **Expected:** Return to login screen
4. **Check Logs:**
   - `[AUTH] Logout requested`
   - `[SECURE] Clearing all secure storage...`
   - `[STORAGE] Native: deleted "app_auth_token" from SecureStore`
   - `[STORAGE] Native: deleted "app_user_id" from SecureStore`

#### Test 3.2: Cannot Access (tabs) After Logout
1. After Test 3.1, try to navigate back
2. **Expected:** Should show login screen, cannot access (tabs)
3. This proves auth gate is working

#### Test 3.3: Login Again After Logout
1. Login with same credentials
2. **Expected:** Works normally
3. Should start fresh session with new token

---

### Phase 4: Error Scenarios

#### Test 4.1: Invalid Password
1. Enter email from Test 1.2
2. Enter wrong password
3. Tap "Entrar"
4. **Expected:** Show error message "Senha incorreta"
5. **Check Logs:** `[AUTH] Password incorrect for: teste@mobile.com`

#### Test 4.2: Non-existent Email
1. Enter non-existent email
2. Tap "Entrar"
3. **Expected:** Show error message "E-mail não encontrado"
4. **Check Logs:** `[AUTH] User not found: nonexistent@email.com`

#### Test 4.3: Duplicate Email on Signup
1. Try to signup with email from Test 1.2
2. **Expected:** Show error "Este e-mail já está cadastrado"

---

## Debug Log Locations

### View Logs in Real-Time
- **Expo Dev Client:** Look at terminal where `npx expo start` is running
- **iOS:** Apple System Log (connect Mac and use Xcode)
- **Android:** Use adb logcat

### Key Log Prefixes to Monitor
- `[AUTH]` - Authentication flow
- `[STORAGE]` - Storage operations (platform type detected)
- `[SECURE]` - Token and secure storage operations
- `[LAYOUT]` - Navigation and routing decisions
- `[ORDER]` - Order creation and management

### Critical Log Messages

**Should See (Indicates Success):**
- `[STORAGE] Native: saved "app_auth_token" to SecureStore` 
- `[STORAGE] Native: retrieved "app_user_id" from SecureStore`
- `[AUTH] Token valid: true`
- `[AUTH] User found! Setting user state`

**Should NOT See (Indicates Problems):**
- `[STORAGE] Fallback: ...to localStorage` (if on iOS/Android)
- `[STORAGE] Native: SecureStore failed` (shouldn't fail)
- `[AUTH] Token expired or invalid` (unless you waited 7 days or intentionally expired)

---

## Quick Test Checklist

Use this after each code change:

```
Authentication:
☐ Signup works
☐ Login works
☐ Session persists after kill/reopen
☐ Logout works
☐ Cannot access (tabs) after logout
☐ Invalid credentials show errors

Cart & Order:
☐ Add items to cart
☐ Confirm order navigates to Pedido screen
☐ Order appears on Pedido screen immediately
☐ Can create multiple orders
☐ History shows all orders

Storage:
☐ [STORAGE] logs show "Native: ...SecureStore" on mobile
☐ NOT seeing "Fallback: ...localStorage" on mobile
☐ Token persists across app kill
☐ User ID persists across app kill

```

---

## Troubleshooting

### Problem: Still seeing login screen after login
- Check: `[AUTH] Token valid: false` in logs?
  - If yes: Token storage not working, check [STORAGE] logs for errors
- Check: Wrong UserID stored?
  - Look for: `[AUTH] User not found in storage, clearing session`
  - This means UserID was saved but user not found in storage

### Problem: See `[STORAGE] Fallback: ...localStorage` on mobile
- SecureStore is failing, should investigate why
- Check if expo-secure-store package is properly installed
- Try: `npm install expo-secure-store@~15.0.8` (correct version for Expo 54)

### Problem: Order not appearing after confirm
- Check: `[ORDER] Order created` in logs?
  - If not: completeOrder() not finishing successfully
- Check: currentOrder state being set?
  - Look for logs about state updates
- Try: Navigate manually to Pedido tab to see if order appears there

### Problem: Can access (tabs) without login
- Check: `[AUTH] Starting session check...` running on startup?
- Check: Auth provider wrapping entire app?
- Look at RootLayout to ensure auth gate is working

---

## Performance Tips

1. **First Load:** First time bundling takes 30-60 seconds, normal
2. **Reload:** Hot reload (Cmd+R or shake device) is much faster
3. **Full Rebuild:** If issues persist, kill dev server and restart with `npx expo start --clean`
4. **Clear Cache:** If weird behavior, try `npx expo start --clear`

---

## Success Criteria

App is ready for production when:

✅ Authentication flow works seamlessly on iOS AND Android
✅ Tokens stored in SecureStore (native storage), NOT localStorage
✅ Session persists across app restart
✅ Cart and order flow works end-to-end
✅ Logout properly clears all tokens
✅ All [AUTH], [STORAGE], [SECURE] logs appear correctly
✅ No errors in console for core functionality
✅ Performance is snappy (< 2 sec per action)
