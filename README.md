# Ali Foods — local-first ordering application

React Native, Expo, TypeScript and Expo Router. This milestone is a working local foundation, not a production restaurant ordering service.

## Included
- Five tabs: Home, Categories, Deals, My Orders, Profile.
- All 34 requested menu entries, nine pizza flavours with three sizes, four roll deals, and four extras.
- Search, product details, variations, toppings, special instructions and quantity selection.
- Persistent local cart, guest checkout validation, unique local order references, COD summaries and manual local tracking.
- Local admin: add/edit/delete products and deals, change prices, availability and featured state, category management, delivery fee and restaurant settings, image selection, and manual order status updates.
- Restaurant calls, WhatsApp links, original menu preview, Google Maps search.

## Important limitations
Orders, customer data, images and admin changes are stored on this device with AsyncStorage. Nothing is sent to the restaurant. There is no secure admin authentication, remote database, cloud image upload, cross-device synchronization, payment collection, or real-time restaurant tracking. The admin dashboard is explicitly a local demo and must not be published for customers. Customer information is not encrypted by this local implementation. Clearing app storage removes local data. Images selected in admin are stored locally as base64 where available; production must use cloud storage instead.

## Menu reference
Original image: https://cdn-ai.onspace.ai/onspace/files/aeo9wgoDYYcPNDvHcTpVBT/Screenshot_2026-11-20_195642.png

Prices are seeded as editable data in services/restaurant.ts and then persisted, not embedded in product components. Currency is PKR. The supplied image is low resolution with a play overlay. Kabab Chaska sizes and Zinger Double Decker remain unpriced; ordering those variants is disabled. “Garo” follows the requested spelling and is flagged for verification. The second phone number is not included because it is unclear. The primary number transcribed is 0330-8325793 and must be verified before launch. Verify every transcribed price against the physical menu before launch. Stock food photography is illustrative, not photography of Ali Foods dishes.

The fixed delivery charge defaults to unconfigured rather than inventing a fee. Open Profile → Open local admin dashboard → Settings → enter a fixed delivery charge → Save restaurant settings to enable test checkout. A zero charge can be deliberately entered if the restaurant offers free delivery. You can update uncertain prices in Menu → Edit. The original menu lists 10 AM to 1 AM; this remains editable.

## Run and check
After exporting complete source from the OnSpace toolbar, install dependencies and run:

```sh
npm install
npx expo start
npx tsc --noEmit
```

Required packages include expo-router, expo-image, expo-image-picker, expo-status-bar, @expo/vector-icons, react-native-safe-area-context and @react-native-async-storage/async-storage. OnSpace resolves missing dependencies automatically. This session did not run a compiler or device build; perform the checks above after export.

## Android preview build
1. Export the source with OnSpace → Download, or connect GitHub.
2. Ensure package identifier `com.alifoods.ordering` belongs to your restaurant, and replace it if needed.
3. Supply your original app icon and Android adaptive icon before production; in-app logo selection does not replace the installed launcher icon.
4. Configure your Expo account and EAS project:

```sh
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The provided eas.json preview profile generates an APK for internal testing. Install it on an Android device. Test empty states, all pizza sizes, unpriced variants, cart edits, restart persistence, delivery fee configuration, guest validation, local order creation, admin CRUD, images, and manual status updates. Never interpret a local test order as an accepted restaurant order.

## Google Play publishing (after the backend phase)
Implement real OnSpace Cloud order storage, secure admin authentication and server-side role authorization first. Remove the public demo dashboard, verify all prices and contacts, enforce server-side totals and delivery fees, and add a privacy policy and customer data controls. Replace illustrative photography and add launcher/splash assets.

```sh
eas build --platform android --profile production
```

This produces an Android App Bundle (AAB). Create the app in Google Play Console, complete the store listing, screenshots, content rating, privacy policy and data safety declarations, upload the AAB to internal testing, then submit production release after testing and review. EAS Submit can be configured separately with Play Console credentials. No live backend, signed build or store submission has been performed in this session.

## Architecture
services/ provides pure local data, persistence and platform operations. contexts/RestaurantContext.tsx supplies shared state. hooks/ contains state and actions. components/ contains reusable presentation. app/ contains Expo Router entry points. constants/theme.ts contains semantic design tokens. All context providers are mounted in app/_layout.tsx.

## Next phases
1. Verify menu data and replace stock images with original restaurant assets.
2. Enable OnSpace Cloud with secure restaurant admin roles and persistent catalog/orders.
3. Add transactional guest order submission, server-calculated totals, live status updates and secure media storage.
