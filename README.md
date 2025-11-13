# Heritage Repository

A consent-based, tiered digital archive platform for preserving and sharing cultural heritage ethically and authentically.

## 🌟 Overview

Heritage Repository is a fullstack web application designed to safeguard living heritage through ethical documentation and tiered access control. The platform enables communities to document, verify, and share Folk Songs, Folk Dances, Folk Tales, Rituals, Material Culture, and Sacred Sites with informed consent.

## ✨ Key Features

### For Contributors
- **Ethical Upload System**: Submit cultural content with required consent documentation
- **Multi-format Support**: Upload text, images, audio, and video files
- **Metadata Management**: Comprehensive tagging and categorization
- **Consent Framework**: Built-in consent tracking and verification

### For Researchers & Learners
- **Tiered Access System**:
  - **Public**: Open to all viewers
  - **Restricted**: Limited to authenticated researchers
  - **Confidential/Sacred**: Accessible only to designated custodians
- **Advanced Search & Filtering**: Filter by country, tribe, cultural domain, and access tier
- **Preview System**: In-app content preview before download
- **Download Tracking**: Monitor content usage and engagement

### For Administrators
- **Content Moderation**: Review and approve submissions
- **User Management**: Manage user accounts and permissions
- **Analytics Dashboard**: Track views, downloads, and engagement metrics

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn
- MongoDB (for backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/heritage-repository.git

# Navigate to project directory
cd heritage-repository

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# VITE_API_URL=http://localhost:5000
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Backend Setup

The frontend expects a backend API running at `http://localhost:5000`. Make sure your backend server is configured and running.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Fetching**: TanStack Query (React Query)
- **Smooth Scrolling**: Lenis
- **Icons**: Lucide React

### Features
- **Authentication**: JWT-based with protected routes
- **File Upload**: Cloudinary integration
- **Forms**: React Hook Form with validation
- **Notifications**: Toast notifications with Sonner
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 📁 Project Structure

```
heritage-repository/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Landing.tsx
│   │   ├── Explore.tsx
│   │   ├── Upload.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── context/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── lib/              # Utility functions
│   ├── assets/           # Static assets
│   └── App.tsx           # Main app component
├── public/               # Public assets
├── .env                  # Environment variables
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
└── package.json          # Dependencies
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000

```

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🌐 Deployment

### Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

The `vercel.json` configuration is already set up for SPA routing.

### Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## 📚 Documentation

### Key Pages

- **Landing (`/`)**: Homepage with overview and roadmap
- **Explore (`/explore`)**: Browse and filter approved content
- **Upload (`/upload`)**: Submit new cultural content (Protected)
- **Profile (`/profile`)**: User dashboard (Protected)
- **Admin (`/admin`)**: Content moderation (Admin only)

### Authentication Flow

1. User signs up or logs in
2. JWT token stored in localStorage
3. Protected routes check authentication status
4. Token included in API requests via Authorization header

### Content Submission Workflow

1. **Collection**: User uploads content with consent documentation
2. **Verification**: Admin reviews and approves/rejects submission
3. **Publication**: Approved content becomes available based on access tier

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Privacy & Ethics

This platform is built on consent-first principles:

- All content requires documented consent from knowledge holders
- Tiered access protects sensitive cultural information
- Download and view tracking for accountability
- Content warnings for culturally sensitive material
- Community-driven verification process

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ethical cultural preservation principles
- Designed for indigenous and community-based heritage organizations
- Respects traditional knowledge protocols

## 📞 Support

For questions or support:
- Create an issue in this repository
- Contact: [mukherjeearnab988@gmail.com]

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced search with AI
- [ ] Community discussion forums
- [ ] Mobile app (React Native)
- [ ] Offline mode for remote areas
- [ ] Blockchain-based consent tracking

---

**Built with ❤️ for cultural preservation**