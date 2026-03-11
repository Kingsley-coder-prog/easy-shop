# ShopEasy E-Commerce Store

Full-stack e-commerce platform with user/admin workflows, payment processing, and order lifecycle management.

## Core features

### Backend
- JWT authentication and role-based authorization (user/admin)
- Product and order management APIs
- User-scoped order history and payment-reference lookups
- Paystack payment initialization + verification + webhook processing
- Email notifications for order updates
- Health endpoints: `/health`, `/ready`

### Frontend
- Vue 3 + Pinia + Vue Router architecture
- Product browsing, cart, checkout, and payment confirmation flow
- User order history page (`/orders`)
- Admin dashboard pages for analytics, reports, users, products, and orders

## DevOps and quality

- CI workflow for frontend/backend checks
- Security workflow for dependency audit
- Staging and production deploy workflows (GitHub Actions)
- Dependabot updates for npm and GitHub Actions

See [DEVOPS_SETUP_GUIDE.md](DEVOPS_SETUP_GUIDE.md) for full setup steps.