# ZenTree Mobile Frontend — AI Development Guidelines

> **Auto-generated from project analysis.** Keep this file in sync whenever architectural or convention changes are made.

---

## 1. Project Overview

| Item | Detail |
|------|--------|
| **App name** | NakUrut / ZenTree (massage booking app) |
| **Framework** | React Native **0.81** with **Expo SDK 54** |
| **Language** | JavaScript (`.js`) — TypeScript config exists but is not actively used |
| **Navigation** | React Navigation **v7** (Native Stack + Bottom Tabs) |
| **UI Library** | React Native Paper (for specific components like `ToggleButton`) |
| **Icons** | `@expo/vector-icons` (Ionicons) |
| **Entry point** | `index.js` → `App.js` |
| **Backend API** | Production: `https://zentree-backend-24l6.onrender.com/api` — Local dev: `http://<LOCAL_IP>:5000/api` |

---

## 2. Directory Structure

```
ZenTree-Mobile-frontend/
├── index.js                    # Expo entry point (registerRootComponent)
├── App.js                      # Root component — NavigationContainer + Stack Navigator
├── app.json                    # Expo configuration (name, splash, icons, platforms)
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config (extends expo/tsconfig.base)
├── navigation/
│   └── MainTabs.js             # Bottom Tab Navigator (Home, Booking, Profile)
├── screens/                    # All screen components
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── HomeScreen.js
│   ├── BookingScreen.js
│   └── ProfileScreen.js
└── assets/                     # Images & icons
    ├── NakUrut Logo.png        # Full logo (used on Login)
    ├── NakUrut Logo only.png   # Icon-only logo (used on Register, splash, adaptive icon)
    ├── icon.png
    ├── adaptive-icon.png
    ├── splash-icon.png
    └── favicon.png
```

---

## 3. Architecture & Navigation Flow

### Navigation Structure

```
NavigationContainer
└── Stack.Navigator (initialRouteName="Login")
    ├── "Login"      → LoginScreen
    ├── "Register"   → RegisterScreen
    ├── "Home"       → HomeScreen
    └── "MainTabs"   → MainTabs (Bottom Tab Navigator)
                        ├── "Home"    → HomeScreen
                        ├── "Booking" → BookingScreen
                        └── "Profile" → ProfileScreen
```

### Flow

1. App launches at **LoginScreen**.
2. User can navigate to **RegisterScreen** to sign up, then back to Login.
3. On successful login, navigate to **MainTabs** (bottom tab navigator).
4. MainTabs provides access to **Home**, **Booking**, and **Profile** tabs.
5. Logout (from ProfileScreen) uses `navigation.replace('Login')` to clear stack.

---

## 4. Component Conventions

### Screen Components

- Each screen is a **functional component** using hooks (`useState`, `useNavigation`).
- Screens are **default exported** from their file.
- Two export styles are used — both are acceptable:
  - **Inline**: `export default function ScreenName() { ... }`
  - **Separate**: `const ScreenName = () => { ... }; export default ScreenName;`

### Navigation Access

- Screens inside `Stack.Navigator` receive `navigation` as a **prop**: `function LoginScreen({ navigation })`.
- Screens inside `Tab.Navigator` use the **hook**: `const navigation = useNavigation()`.
- Both approaches are valid. Use the pattern matching the component's context.

### State Management

- Use `useState` for **local component state**.
- No global state library (Redux, Zustand, Context) is currently used.
- User data (e.g., profile info) is currently **hardcoded** — future: fetch from API and/or use `AsyncStorage`.

---

## 5. Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Screens | `{Name}Screen.js` | `LoginScreen.js`, `BookingScreen.js` |
| Navigation | `{Name}.js` (descriptive) | `MainTabs.js` |
| Assets | Descriptive names | `NakUrut Logo only.png` |

- **PascalCase** for all component files.
- Screen files must be placed in the `screens/` directory.
- Navigation files must be placed in the `navigation/` directory.

### Variables & Functions

- **camelCase** for variables, functions, and state: `handleLogin`, `setEmail`, `modalVisible`.
- **PascalCase** for component names: `HomeScreen`, `MainTabs`, `BookingScreen`.
- Event handlers use the `handle` prefix: `handleLogin`, `handleRegister`, `handleBooking`, `handleSearch`.
- State setters follow React convention: `[value, setValue]` — e.g., `[email, setEmail]`.

---

## 6. Styling Rules

### StyleSheet

- Use `StyleSheet.create({})` for defining styles — not inline objects.
- Two placement patterns exist:
  - **Outside component** (preferred for larger screens): Defined after the component as a `const styles` — used in `HomeScreen`, `ProfileScreen`, `BookingScreen`.
  - **Inside component** (acceptable for small screens): Defined inside the function body — used in `LoginScreen`, `RegisterScreen`.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary Brown** | `#B5651D` | Buttons, titles, active tab tint, branding |
| **Link Blue** | `#2E86C1` | Text links (e.g., "Register") |
| **Teal/Green** | `#008080` | Price text, accent |
| **Card Blue** | `#007bff` | Booking search button |
| **Danger Red** | `#E63946` | Logout button |
| **Light Teal** | `#e6f3f2` | Category card backgrounds |
| **Background White** | `#ffffff` | Screen backgrounds |
| **Light Grey** | `#f2f2f2`, `#f9f9f9` | Search bar, info boxes, cards |
| **Border Grey** | `#ccc`, `#aaa` | Input borders, card borders |
| **Text Dark** | `#333` | Primary text |
| **Text Muted** | `#777`, `#888` | Subtitles, labels, placeholders |
| **Inactive Tab** | `gray` | Bottom tab inactive tint |

> **Rule:** Use the existing palette. Do not introduce new colors without checking this table first.

### Common Style Patterns

```js
// Inputs
input: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 15,
}

// Primary button
button: {
  width: '100%',
  backgroundColor: '#B5651D',
  padding: 15,
  borderRadius: 8,
  alignItems: 'center',
}

// Button text
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
}
```

---

## 7. API Integration Rules

### HTTP Requests

- Use the native **`fetch` API** — no Axios or other HTTP libraries.
- All API calls use `async/await` inside `try/catch` blocks.
- Set `Content-Type: application/json` for POST requests.

### Base URLs

| Environment | Base URL |
|-------------|----------|
| **Production** | `https://zentree-backend-24l6.onrender.com/api` |
| **Local Dev** | `http://<YOUR_LOCAL_IP>:5000/api` |

> **Important:** Local dev uses the machine's **LAN IP address** (e.g., `192.168.0.9`), not `localhost`, because the app runs on a mobile device/emulator.

### Request Pattern

```js
const handleAction = async () => {
  try {
    const response = await fetch("https://zentree-backend-24l6.onrender.com/api/{endpoint}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ /* payload */ }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success — navigate or update state
    } else {
      alert(data.message || "Default error message");
    }
  } catch (error) {
    console.error("Action error:", error);
    alert("Something went wrong. Please try again.");
  }
};
```

### Authentication

- Login returns a JWT `token` in the response.
- **TODO**: Store token with `AsyncStorage` and attach to authenticated requests as `Authorization: Bearer <token>`.
- Currently, token storage is **not yet implemented** (commented out in `LoginScreen.js`).

---

## 8. Form Handling

### Simple Forms (Login)

- Use individual `useState` hooks for each field:
  ```js
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  ```

### Complex Forms (Register)

- Use a single `useState` with an **object**:
  ```js
  const [form, setForm] = useState({
    firstName: '', lastName: '', gender: '', dateOfBirth: new Date(), phone: '', email: '', password: '',
  });
  ```
- Update fields with spread: `setForm({ ...form, fieldName: value })`.

### Input Validation

- Validate **before** API calls.
- Use `alert()` for user-facing validation errors (simple pattern, may evolve to toast/snackbar).
- Check for empty fields with truthiness: `if (!field) { alert(...); return; }`.

### Date Picker

- Use `@react-native-community/datetimepicker`.
- Toggle visibility with a `showDatePicker` state.
- Handle platform differences: on iOS, keep picker open; on Android, auto-close.

---

## 9. Bottom Tab Navigator Configuration

```js
// Tab bar options
tabBarActiveTintColor: '#B5651D'    // Brown theme
tabBarInactiveTintColor: 'gray'

// Icons (Ionicons outline style)
Home    → 'home-outline'
Booking → 'calendar-outline'
Profile → 'person-outline'
```

- Always use **outline** icon variants for tab bar icons.
- Import icons from `@expo/vector-icons` (bundled with Expo).

---

## 10. Adding a New Screen — Checklist

1. **Create the screen file** in `screens/{Name}Screen.js`.
2. **Functional component** with `export default function {Name}Screen()`.
3. **Add styles** using `StyleSheet.create()` — follow established color palette.
4. **Add to navigation**:
   - If it's a **full-page flow** (like Login/Register): add a `Stack.Screen` in `App.js`.
   - If it's a **tab page**: add a `Tab.Screen` in `navigation/MainTabs.js` with an Ionicons icon.
5. **API calls** (if any): use `fetch` with `try/catch`, matching the existing pattern.
6. **Wire navigation**: use `navigation.navigate('ScreenName')` or `navigation.replace('ScreenName')`.

---

## 11. Adding a New Navigator — Checklist

1. **Create the navigator file** in `navigation/{Name}.js`.
2. **Import screen components** from `../screens/`.
3. **Export as default function**.
4. **Nest inside the root Stack** in `App.js` as a `Stack.Screen`.

---

## 12. Scripts & Development

| Command | Purpose |
|---------|---------|
| `npm start` / `expo start` | Start Expo dev server |
| `npm run android` | Start on Android emulator/device |
| `npm run ios` | Start on iOS simulator |
| `npm run web` | Start in web browser |

- Use **Expo Go** app on physical devices for testing.
- The app is configured for **portrait orientation** only (`app.json`).
- **New Architecture** is enabled (`"newArchEnabled": true`).
- Android uses **edge-to-edge** mode (`"edgeToEdgeEnabled": true`).

---

## 13. Dependencies Reference

| Package | Version | Purpose |
|---------|---------|---------|
| `expo` | ~54.0.12 | Core Expo SDK |
| `react` | 19.1.0 | React |
| `react-native` | 0.81.4 | React Native |
| `@react-navigation/native` | ^7.1.18 | Navigation core |
| `@react-navigation/native-stack` | ^7.3.27 | Stack navigator |
| `@react-navigation/bottom-tabs` | ^7.4.8 | Bottom tab navigator |
| `react-native-screens` | ^4.16.0 | Native screen containers |
| `react-native-safe-area-context` | ^5.6.1 | Safe area handling |
| `react-native-paper` | ^5.14.5 | Material Design components |
| `react-native-vector-icons` | ^10.3.0 | Icon library |
| `@react-native-community/datetimepicker` | 8.4.4 | Date/time picker |
| `expo-status-bar` | ~3.0.8 | Status bar management |
| `typescript` | ~5.9.2 | TypeScript (devDependency) |

> **Note:** `cors`, `dotenv`, `express`, and `nodemon` are listed in `package.json` but are **backend dependencies** — they should not be in this project. They are likely leftover from copy-paste.

---

## 14. Code Style & Best Practices

1. **Functional components only** — No class components.
2. **Hooks for state** — Use `useState` for local state, `useNavigation` for navigation.
3. **`async/await`** for all asynchronous operations — no `.then()` chains.
4. **`try/catch`** around every API call.
5. **`alert()`** for error feedback to users (simple pattern, consider upgrading to toast/snackbar).
6. **No inline styles** for complex layouts — always use `StyleSheet.create()`.
7. **One screen per file** — screens are self-contained.
8. **Import from relative paths** — e.g., `'../screens/HomeScreen'`, `'../assets/logo.png'`.
9. **No global state yet** — when adding, consider React Context or AsyncStorage first before introducing a library.
10. **Keep dummy data clearly marked** — use comments or separate constants for mock/placeholder data until backend integration is complete.
