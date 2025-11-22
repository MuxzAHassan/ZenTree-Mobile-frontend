# NakUrut Product Requirement Document v1.0

## 1. Executive Summary

**Product Name:** NakUrut  
**Product Type:** Massage Booking Mobile Application  
**Platform:** React Native (iOS/Android)  
**Timeline:** 6 months for MVP (2 months per persona)  
**Target Market:** Malaysia

NakUrut is a centralized massage booking platform that connects customers with massage service providers (individual masseurs and massage companies). The platform aims to streamline the process of finding, booking, and managing massage appointments with professional therapists and massage businesses.

---

## 2. Problem Statement

In Malaysia, massage services are a common and thriving business. However, there is a fragmented market with no unified platform for customers to:
- Discover qualified masseurs and massage businesses
- Book appointments conveniently
- Verify service quality through reviews
- Manage payments securely

Currently, customers either contact masseurs individually or visit physical locations, leading to:
- Limited transparency and service quality assurance
- Difficulty discovering new service providers
- Lack of centralized booking management
- No standardized payment or rating system

---

## 3. Objectives & Success Metrics

### Primary Objectives
1. Create a user-friendly platform for customers to book massage services
2. Enable service providers to manage bookings and build their reputation
3. Establish a trustworthy ecosystem through ratings and reviews
4. Support multiple languages (English & Bahasa Malaysia)

### Success Metrics (TBD in Phase 2)
- User acquisition targets
- Booking completion rate
- Provider satisfaction score
- Platform engagement metrics

---

## 4. User Personas & Roles

### 4.1 Customer
**Definition:** End user seeking massage services  
**Key Goals:**
- Find nearby massage service providers
- Book appointments conveniently
- Track booking history
- Rate and review services

### 4.2 Partner
**Definition:** Individual masseur or massage company offering services  
**Key Goals:**
- Manage service offerings and pricing
- Accept/manage customer bookings
- Build reputation through customer ratings
- Expand customer base

### 4.3 Admin (Web Dashboard)
**Definition:** Platform administrator  
**Key Goals:**
- Monitor platform activity (bookings, users, partners)
- Validate new user and partner registrations
- Activate/deactivate users and partners
- Resolve disputes and manage ratings

---

## 5. Feature Specifications

### 5.1 Authentication & Registration

#### 5.1.1 Customer Registration
**User Input Fields:**
- First Name (required)
- Last Name (required)
- Gender (required) - dropdown: Male/Female
- Date of Birth (required) - date picker
- Phone Number (required) - formatted validation
- Email (required) - email validation
- Password (required) - min 8 characters
- Type (auto-selected as "Customer")

**Registration Process:**
1. User enters information
2. System validates email uniqueness
3. Password encrypted and stored
4. User account created (status: Active)
5. Redirect to Login screen

#### 5.1.2 Partner Registration
**User Input Fields:**
- First Name (required)
- Last Name (required)
- Gender (required) - dropdown: Male/Female
- Date of Birth (required) - date picker
- Phone Number (required)
- Email (required)
- Password (required) - min 8 characters
- Type (auto-selected as "Partner")
- **Business Type (required)** - dropdown: Individual/Company
- If Company:
  - Company Name (required)
  - Company Registration Number (required)
  - *Business License verification (TBD - Phase 2)*

**Registration Process:**
1. Partner enters information
2. System validates email uniqueness
3. Business details validated (if company)
4. Account created with status: "Pending Validation"
5. Admin reviews and activates account
6. Confirmation sent to partner

#### 5.1.3 Login
**Functionality:**
- Email and password authentication
- Remember me option (optional)
- Password reset via email (TBD)
- Error handling for invalid credentials

### 5.2 Customer Features

#### 5.2.1 Dashboard
**Displays:**
- Current booking status (if any active)
- Booking history (past 12 months)
- Quick access to search
- Suggested services based on history
- Current user location

**Components:**
- Summary card of next appointment
- List of past bookings with partner info
- Quick action buttons

#### 5.2.2 Search & Browse Services
**Search Parameters:**
- Massage Service Type (dropdown):
  - Traditional Massage
  - Sports Massage
  - Chiropractor
- Location-based search (automatic based on GPS)
- Search radius (progressive):
  - 1st search attempt: 5km radius (10 seconds to load)
  - 2nd search attempt: 10km radius (20 seconds additional)
  - User can manually expand radius

**Search Results Display:**
- Partner name
- Service types offered
- Ratings (average stars)
- Number of reviews
- Service area coverage
- Distance from user location
- Availability status

**Partner Profile:**
- Service details (type, duration, pricing)
- Partner information (name, gender, qualifications - TBD)
- Service availability calendar
- Customer reviews and ratings
- Response rate and reliability metrics

#### 5.2.3 Booking System
**Booking Flow:**
1. User selects service type
2. User selects massage duration (partner-defined options):
   - Example: 30 min, 60 min, 90 min
   - Price displays for each duration
3. User selects date and time from partner's available slots
4. System shows booking summary:
   - Service type
   - Duration
   - Date & time
   - Price
   - Deposit amount (TBD - percentage)
5. User proceeds to payment
6. Booking confirmed with reference number
7. Confirmation sent to both customer and partner

**Booking Constraints:**
- Maximum advance booking: 7 days
- Partner cannot book beyond 7 days
- Only available time slots shown
- Real-time availability management

**Booking Status:**
- Pending (awaiting partner acceptance)
- Confirmed
- In Progress
- Completed
- Cancelled

#### 5.2.4 Booking Management
**Customer Can:**
- View all bookings (upcoming and past)
- Cancel booking (with deposit policy):
  - If cancelled before 24 hours: Full deposit retention
  - *Refund policy details TBD*
- Reschedule booking (TBD - Phase 2)
- View partner details
- Contact support (TBD - Phase 2)

**Booking History:**
- Filter by status (Completed, Cancelled, etc.)
- Sort by date
- Re-book same service (quick booking)

#### 5.2.5 Rating & Review System
**Available After Service Completion:**
- Star rating (1-5 stars, required)
- Review text (optional, max 500 characters)
- Photo upload (optional - TBD)
- Service quality aspects (TBD - detailed criteria)

**Review Visibility:**
- Public (visible to all users)
- Reviews cannot be edited by customer after submission
- Can only be removed by admin
- Display average rating and individual reviews on partner profile

#### 5.2.6 User Profile & Settings
**Profile Management:**
- View/edit personal information (except email & registration type)
- Change password
- Manage contact information
- Payment methods (TBD)

**Settings:**
- Language preference (English / Bahasa Malaysia)
- Notification preferences (TBD)
- Privacy settings (TBD)
- Account deletion (TBD)

### 5.3 Partner Features

#### 5.3.1 Dashboard
**Displays:**
- Current booking status (if any active)
- Booking history (past 12 months)
- Customer count
- Ratings overview
- Service area coverage

**Components:**
- Summary card of next appointment
- List of bookings (pending, confirmed, completed)
- Revenue metrics (TBD - Phase 2)

#### 5.3.2 Service Management
**Partner Can:**
- Define available massage service types:
  - Traditional Massage
  - Sports Massage
  - Chiropractor
- For each service, specify:
  - Duration options (30 min, 60 min, 90 min, etc.)
  - Price per duration
  - Description (TBD)

**Service Availability:**
- Set working hours (recurring schedule)
- Set holidays/days off
- Block specific time slots
- Enable/disable services temporarily

#### 5.3.3 Booking Management
**Partner Can:**
- View all pending booking requests
- Accept booking:
  - Status changes to "Confirmed"
  - Customer receives confirmation
- Decline booking (with optional reason - TBD):
  - Status changes to "Declined"
  - Customer receives notification
- Mark booking as "In Progress" on service day
- Mark booking as "Completed" after service

**Booking History:**
- View all past bookings
- Filter by status
- Sort by date

#### 5.3.4 Rating & Review Management
**Partner Can:**
- View all customer reviews
- Rate customers (1-5 stars) after service completion
- View rating statistics
- See which customers provided reviews

**Review Handling:**
- Cannot edit or delete reviews (admin handles disputes)
- Can respond to reviews (TBD - Phase 2)
- Reviews impact their rating

#### 5.3.5 Partner Profile & Settings
**Profile Management:**
- View/edit personal information (except email)
- Change password
- Update business type and details (if company)
- Service area coverage (TBD)

**Settings:**
- Language preference (English / Bahasa Malaysia)
- Notification preferences (TBD)
- Payment settings (TBD)

### 5.4 Admin Features (Web Dashboard)

#### 5.4.1 Dashboard
**Displays:**
- Key metrics:
  - Total users and partners
  - Total bookings (this month, all-time)
  - Average platform rating
  - Active users (last 30 days)
- Charts and graphs (TBD)

#### 5.4.2 User Management
**Admin Can:**
- View all registered customers
- View customer details
- Activate/deactivate customer accounts
- Search and filter users
- View user booking history
- Handle user reports/disputes (TBD)

#### 5.4.3 Partner Management
**Admin Can:**
- View all partners (active, pending, inactive)
- Review new partner registrations (pending status)
- Validate partner information:
  - Verify business details (if company)
  - Check documents (TBD - Phase 2)
- Approve/reject new partners
- Activate/deactivate partners
- View partner service offerings
- View partner booking history
- Monitor partner ratings and reviews

#### 5.4.4 Booking Oversight
**Admin Can:**
- View all bookings
- Filter by status, date range, partner, customer
- View booking details
- Investigate disputed bookings (TBD)

#### 5.4.5 Rating & Review Management
**Admin Can:**
- View all reviews and ratings
- Monitor for inappropriate content (TBD)
- Remove reviews (if disputed or violating policies)
- Resolve rating disputes (TBD)
- View review statistics

#### 5.4.6 Reporting & Analytics (TBD - Phase 2)
- User growth trends
- Booking trends
- Partner performance metrics
- Revenue analytics
- Platform health monitoring

---

## 6. Service Types & Specifications

### 6.1 Available Massage Services
1. **Traditional Massage** - Deep tissue, relaxation-focused massage
2. **Sports Massage** - Athletic recovery and injury prevention
3. **Chiropractor** - Spinal alignment and therapeutic manipulation

### 6.2 Service Duration & Pricing
- Partners define duration options:
  - Minimum: 30 minutes
  - Common: 30 min, 60 min, 90 min, 120 min
  - Partners set price for each duration
- Pricing visible during booking

---

## 7. Booking & Payment System

### 7.1 Booking Policy
- **Advance Booking:** Up to 7 days in advance
- **Same-Day Booking:** Allowed if partner has availability
- **Deposit:** Required at booking (percentage TBD in Phase 2)
- **Payment Timing:** Deposit at booking, balance on service completion (TBD)

### 7.2 Cancellation & Refund Policy
**Customer Cancellation:**
- If cancelled before 24 hours notice: **No deposit refund** (deposit retained)
- If cancelled with 24+ hours notice: **Full deposit refund** (TBD - flexible)
- Details and exceptions TBD in Phase 2

**Partner Cancellation:**
- Partner can decline booking (TBD - limits/penalties)
- Customer receives full refund (including deposit)

**System Cancellation:**
- Admin can cancel for policy violations
- Appropriate refunds issued (TBD)

### 7.3 Payment Methods (TBD - Phase 2)
- Credit card
- Debit card
- E-wallet integration
- Cash on-site option (TBD)

---

## 8. Location & Search System

### 8.1 Location-Based Search
**Search Radius Progressive Loading:**
- **First Search Attempt (10 seconds):** 5 km radius
  - Returns providers within 5 km
  - If insufficient results, suggest expanding
- **Expanded Search (20 seconds additional):** 10 km radius
  - Returns additional providers
- **User Manual Expansion:** Can select custom radius (TBD)

**Location Accuracy:**
- Uses device GPS location
- User can manually enter address (TBD)
- Service area defined by partner (registered service radius)

### 8.2 Service Area Coverage
- Partners register their service areas (addresses/postcodes they serve)
- Search shows only partners serving the customer's area
- Partners cannot book outside their service areas

### 8.3 Availability Display
- Partner availability calendar shows:
  - Available time slots
  - Booked slots (greyed out)
  - Closed dates/holidays
  - Real-time updates

---

## 9. Localization & Multi-Language Support

### 9.1 Supported Languages
1. **English** - Default language
2. **Bahasa Malaysia (BM)** - Secondary language

### 9.2 Localization Scope
- All UI text, buttons, messages
- Error messages and validations
- Booking confirmations
- Review and rating prompts
- Admin interface (TBD)

### 9.3 User Language Preference
- Selectable during registration
- Changeable in settings
- Default based on device language
- Persistent across sessions

---

## 10. Non-Functional Requirements

### 10.1 Security
- Password encryption (bcrypt or similar)
- Secure API endpoints
- Data encryption in transit (HTTPS)
- User data privacy compliance (TBD - local regulations)

### 10.2 Performance
- App load time < 3 seconds
- Search results < 2 seconds
- Booking confirmation < 1 second
- Real-time notifications (TBD)

### 10.3 Scalability
- Support 10,000+ concurrent users (TBD based on growth)
- Database optimization for queries
- Caching strategy for frequently accessed data

### 10.4 Reliability
- 99.5% uptime SLA (TBD)
- Automated backups
- Error handling and logging
- Crash reporting

### 10.5 Compatibility
- iOS 12.0+
- Android 8.0+
- Responsive design
- Offline capability (TBD)

---

## 11. Technical Architecture

### 11.1 Tech Stack
| Component | Technology |
|-----------|-----------|
| Frontend | React Native |
| Backend | Express.js |
| Database | MySQL |
| Hosting | Hybrid (Firebase + Railway) |
| APIs | Custom REST APIs |

### 11.2 Key APIs
1. **Authentication API** - Login, registration, password reset
2. **Booking API** - Create, update, cancel, retrieve bookings
3. **Service API** - Browse services, view availability
4. **Rating API** - Submit, retrieve ratings and reviews
5. **User API** - Profile management
6. **Admin API** - User/partner management, moderation

### 11.3 Database Schema (TBD - Detailed ERD)
- Users table
- Partners table
- Services table
- Bookings table
- Ratings & Reviews table
- Admin Logs table

---

## 12. User Journey & Workflows

### 12.1 Customer Journey
```
Register/Login → Browse Services → Search → Select Service → 
Make Booking → Pay Deposit → Await Confirmation → Receive Service → 
Rate & Review → View History
```

### 12.2 Partner Journey
```
Register → Validation (Admin) → Approval → Setup Services → 
Manage Availability → Accept Bookings → Provide Service → 
Receive Rating
```

### 12.3 Admin Journey
```
Dashboard → Monitor Activity → Manage Users/Partners → 
Validate Registrations → Moderate Reviews → Handle Disputes
```

---

## 13. Out of Scope (Phase 2 & Future)

### Features Not in MVP
- **Payment Integration** - Fully integrated payment gateway
- **Real-time Notifications** - Push notifications for bookings
- **Messaging System** - In-app chat between customer and partner
- **Advanced Analytics** - Detailed reporting and insights
- **Dispute Resolution** - Formal mediation process
- **Partner Verification** - Document/qualification verification
- **Insurance & Liability** - Insurance coverage details
- **Rescheduling** - Rebooking at different date/time
- **Promo & Discounts** - Promotional code system
- **Franchise/Multi-location** - Support for partner chains
- **Advanced Search Filters** - Filter by gender, experience, etc.
- **Rating Appeals** - Customers disputing poor reviews
- **Offline Booking** - Walk-in booking management
- **Subscription Plans** - Membership tiers (TBD)
- **API Documentation** - Third-party integration
- **Emergency Services** - Express/urgent booking

---

## 14. Success Criteria & Metrics

### MVP Launch Criteria
- ✓ All core features for 3 personas implemented
- ✓ 50+ partners registered and active
- ✓ 500+ customer downloads
- ✓ Average rating 4.0+ stars
- ✓ 80% booking completion rate

### Key Performance Indicators (TBD)
- User acquisition rate
- Partner acquisition rate
- Booking conversion rate
- User retention rate
- Average booking value
- Platform satisfaction score

---

## 15. Development Timeline (6 Months)

| Phase | Duration | Focus |
|-------|----------|-------|
| Phase 1 | Month 1-2 | Customer Platform (Frontend + Backend) |
| Phase 2 | Month 3-4 | Partner Platform (Frontend + Backend) |
| Phase 3 | Month 5-6 | Admin Dashboard + Integration + Testing |

---

## 16. Release Notes

**Version 1.0 (MVP)**
- Initial release with core booking functionality
- Support for 3 massage service types
- Customer and partner platforms
- Basic admin dashboard
- English and Bahasa Malaysia support

---

## 17. Assumptions & Dependencies

### Assumptions
- Users have GPS-enabled smartphones
- Partners have consistent internet connectivity
- Payment infrastructure will be integrated in Phase 2
- Regulatory compliance is handled separately

### Dependencies
- React Native stable version
- Express.js server stability
- MySQL database performance
- Firebase/Railway infrastructure availability

---

## 18. Approval & Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | TBD | | |
| Tech Lead | TBD | | |
| Business Owner | TBD | | |

---

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**Next Review:** Upon MVP completion
