# DevFest Ibadan 🎉

The official website for DevFest Ibadan - the largest GDG (Google Developer Groups) event in Ibadan! Join us on **November 28th and 29th, 2025 at 8:00 AM** at Jogor Center, No. 1 Harvester Drive, Liberty Road, New GRA, Ibadan for a day filled with inspiration, innovation, and connection.

## 🌟 About DevFest Ibadan

DevFest Ibadan is where over 1,000 Software Engineers, Designers, Tech Professionals and enthusiasts come together to explore cutting-edge technology and shape the future. No matter where you are on your tech journey, this event is designed for you. Experience a day packed with insightful talks, hands-on workshops, and networking opportunities with industry leaders, tech innovators, and creative thinkers.

**Event Details:**

- 📅 **Date:** November 28th and 29th, 2025
- 🕰️ **Time:** 8:00 AM prompt
- 📍 **Venue:** Jogor Center, No. 1 Harvester Drive, Liberty Road, New GRA, Ibadann
- 🎟️ **Registration:** [Get Your Ticket](https://devfestibadan.com/tickets)

## ✨ Current Features

This website includes the following sections and features:

### 🏠 **Homepage Sections**

- **Hero Section** - Event introduction and call-to-action
- **Inclusivity Section** - Event details and date information with calendar integration
- **Recap Section** - Highlights from previous events
- **Countdown Timer** - Live countdown to the event date
- **Venue Information** - Event location details and imagery
- **Speakers Showcase** - Featured speakers and their profiles
- **Sponsors Display** - Event sponsors and partners
- **Merchandise Store** - Official DevFest merchandise with Selar integration

### 📄 **Ticketing System**

- **Ticket form** (`/tickets`) - Where attendees get to fill the registration form
- **Ticket checkout** (`/tickets`) - Where attendees can purchase tickets
- **Payment success** (`/payment/success`) - Confirmation page after successful payment

### 📄 **Ticketing Admin System**

- **Admin login** (`/admin`) - Where admin get to login
- **All Payments** (`/admin/payments`) - Where admin gets to see all the payments and can check-in attendees who have paid for the ticket
- **Add attendee** (`/admin/payments`) - Admin can add attendees to the event and a payment url will be sent to the attendee's email to purchase ticket
- **All Payments** (`/admin/payments`) - Admin can export data in CVS and Excel format

### 📄 **Additional Pages**

- **Speakers Page** (`/speakers`) - Detailed speaker profiles and bios
- **Schedule/Agenda Page** (`/schedule`) - Event timeline and session details
- **Sponsors Page** (`/sponsors`) - Complete sponsor information
- **Team/Organizers Page** (`/team`, `/organizers`) - Meet the organizing team

### 🎨 **UI/UX Features**

- **Responsive Design** - Optimized for desktop and mobile devices
- **Smooth Scrolling** - Enhanced user experience with Lenis smooth scrolling
- **Animations** - Interactive animations using Framer Motion and GSAP
- **Modern Components** - Built with Radix UI and custom components
- **Accessibility** - Accordion components and proper semantic HTML

### 🛠️ **Technical Features**

- **TypeScript** - Full type safety and better development experience
- **Modern Styling** - Tailwind CSS with custom color palette matching Google brand
- **Code Quality** - ESLint, Prettier, and Husky for consistent code formatting
- **Performance Optimized** - Next.js Image optimization and font loading
- **SEO Ready** - Proper metadata and semantic HTML structure

## 📁 Project Structure

```
devfest-Ibadan/
├── app/                          # Next.js App Router directory
│   ├── _module/                  # Internal modules and utilities
│   │   ├── components/           # Shared components
│   │   │   ├── animations/       # Animation components
│   │   │   ├── cards/           # Card components
│   │   │   ├── common/          # Common UI components (Header, Footer, etc.)
│   │   │   ├── icons/           # Icon components
│   │   │   ├── menulink/        # Navigation components
│   │   │   └── ui/              # Base UI components
│   │   ├── config/              # Configuration files
│   │   ├── data/                # Static data and content
│   │   ├── lib/                 # Utility functions and libraries
│   │   └── shared/              # Shared resources
│   ├── ticket/                 # Ticket registration and payment
│   │   ├── components/         # Ticket-specific components
│   │   ├── success/            # Payment success page
│   │   └── page.tsx            # Main ticket page
│   ├── admin/                  # Admin dashboard
│   │   ├── components/         # Admin interface components
│   │   ├── payments/           # Payment management
│   │   ├── attendees/          # Attendee management
│   │   └── page.tsx            # Admin dashboard page
│   ├── payment/                 # Payment processing
│   │   ├── components/         # Payment-specific components
│   │   ├── success/            # Success page components
│   │   ├── failed/             # Failed payment components
│   │   └── page.tsx            # Main payment page
│   ├── component/               # Page-specific components
│   │   ├── CountDown.tsx        # Event countdown timer
│   │   ├── DevfestHero.tsx      # Hero section component
│   │   ├── Inclusivity.tsx      # Inclusivity section
│   │   ├── OurMerch.tsx         # Merchandise showcase
│   │   ├── OurSpeakers.tsx      # Speakers section
│   │   ├── OurSponsors.tsx      # Sponsors section
│   │   ├── Recap.tsx            # Event recap section
│   │   └── Venue.tsx            # Venue information
│   ├── agenda/                  # Agenda/Schedule page
│   ├── organizers/              # Organizers page
│   ├── schedule/                # Schedule page
│   ├── speakers/                # Speakers page and data
│   ├── sponsors/                # Sponsors page
│   ├── team/                    # Team page
│   ├── shared/                  # Shared app resources
│   │   └── font.tsx             # Font configurations
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Homepage component
├── components/                   # Additional shared components
│   └── ui/                      # Shadcn/ui components
├── public/                      # Static assets
│   ├── fonts/                   # Custom font files
│   ├── speakers/                # Speaker images
│   └── [images]                 # Event images, logos, merchandise
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
├── docs/                        # Documentation
│   └── contributing.md          # Contribution guidelines
├── commitlint.config.js         # Commit linting configuration
├── components.json              # Shadcn/ui components configuration
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 📦 Package Manager

This project uses **Yarn** as the package manager. You can identify this by the presence of `yarn.lock` file in the root directory.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 18 or higher)
- **Yarn** package manager

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gdg-ibadan01/devfest-Ibadan.git
   cd devfest-Ibadan
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Run the development server:**

   ```bash
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

### Available Scripts

- `yarn dev` - Start the development server
- `yarn build` - Build the application for production
- `yarn start` - Start the production server
- `yarn lint` - Run ESLint for code linting
- `yarn prettier` - Format code using Prettier
- `yarn prepare` - Set up Husky git hooks

## 🛠️ Tech Stack

### **Frontend Framework**

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript

### **Styling & UI**

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Custom Google Brand Colors** - Core blue, red, green, yellow with pastel variants

### **Animations & Interactions**

- **Framer Motion** - Animation library
- **GSAP** - Professional animation library
- **Lenis** - Smooth scrolling library

### **Development Tools**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Commitlint** - Conventional commit messages
- **Lint-staged** - Run linters on staged files

### **External Integrations**

- **Selar** - Merchandise store integration
- **GDG Community** - Event registration platform
- **Sessionize** - Speaker management (configured in Next.js)

## 🎨 Design System

The project uses a comprehensive design system based on Google's brand colors:

### **Core Colors**

- **Blue:** `#4285f4` (core-blue)
- **Red:** `#ea4335` (core-red)
- **Green:** `#34a853` (core-green)
- **Yellow:** `#f9ab00` (core-yellow)

### **Pastel Variants**

- **Pastel Blue:** `#c3ecf6`
- **Pastel Green:** `#ccf6c5`
- **Pastel Yellow:** `#ffe7a5`
- **Pastel Red:** `#f8d8d8`

### **Typography**

- **Primary Font:** Google Sans (custom font files included)
- **Headings:** FK Grotesk Neue Trial (various weights)
- **Display:** Caleit Bold

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./docs/contributing.md) for details on our code of conduct and the process for submitting pull requests.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Run `yarn lint` and `yarn prettier` to ensure code quality
5. Commit your changes using conventional commit messages
6. Push to your fork and submit a pull request

## 📄 License

This project is licensed under the MIT License. See the [Contributing Guidelines](./docs/contributing.md) for more information.

## 🌐 Links

- **🎟️ Event Registration:** [GDG Community Platform](https://devfestibadan.com/ticket)
- **🛍️ Official Merchandise:** [Selar Store](https://selar.co/m/gdg-ibadan1)
- **📧 Contact:** Reach out to the GDG Ibadan team for any inquiries

## 📱 Social Media

Stay connected and get the latest updates about DevFest Ibadan through our social media channels and the GDG Ibadan community.

---

**Built with ❤️ by the GDG Ibadan team for the tech community in Ibadan and beyond!**
