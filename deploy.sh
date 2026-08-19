#!/bin/bash
# deploy.sh - One-command production deployment
# Usage: ./deploy.sh [vercel|docker|railway]

set -e

DEPLOY_TARGET=${1:-vercel}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================"
echo "  SANCTUM PRODUCTION DEPLOYMENT"
echo "============================================"
echo "Target: $DEPLOY_TARGET"
echo ""

# Check prerequisites
check_prereqs() {
    echo "Checking prerequisites..."
    command -v pnpm >/dev/null 2>&1 || { echo "pnpm not found"; exit 1; }
    command -v node >/dev/null 2>&1 || { echo "Node.js not found"; exit 1; }
    echo "✓ Prerequisites OK"
}

# Load environment
load_env() {
    if [ -f "$PROJECT_ROOT/apps/web/.env.production" ]; then
        export $(cat "$PROJECT_ROOT/apps/web/.env.production" | grep -v '^#' | xargs)
        echo "✓ Loaded production environment"
    else
        echo "WARNING: .env.production not found"
    fi
}

# Build all packages
build_all() {
    echo ""
    echo "Building all packages..."
    cd "$PROJECT_ROOT"
    pnpm install --frozen-lockfile
    pnpm --filter=@platform/web build
    echo "✓ Build complete"
}

# Deploy to Vercel
deploy_vercel() {
    echo ""
    echo "Deploying to Vercel..."
    cd "$PROJECT_ROOT/apps/web"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy
    vercel --prod --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID"
    echo "✓ Vercel deployment complete"
}

# Deploy with Docker Compose
deploy_docker() {
    echo ""
    echo "Deploying with Docker Compose..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "Docker not found. Please install Docker Desktop."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        echo "Docker Compose not found."
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
    
    # Build images
    echo "Building Docker images..."
    docker-compose -f docker-compose.prod.yml build
    
    # Start services
    echo "Starting services..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for health checks
    echo "Waiting for services to be healthy..."
    sleep 10
    
    # Check health
    if curl -f http://localhost:3000/ > /dev/null 2>&1; then
        echo "✓ Web app healthy"
    else
        echo "WARNING: Web app health check failed"
    fi
    
    if curl -f http://localhost:5984/_up > /dev/null 2>&1; then
        echo "✓ CouchDB healthy"
    else
        echo "WARNING: CouchDB health check failed"
    fi
    
    echo "✓ Docker deployment complete"
    echo "Web app: http://localhost:3000"
    echo "CouchDB: http://localhost:5984"
}

# Deploy to Railway
deploy_railway() {
    echo ""
    echo "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    railway login
    railway up --detach
    echo "✓ Railway deployment complete"
}

# Main
main() {
    check_prereqs
    load_env
    build_all
    
    case $DEPLOY_TARGET in
        vercel)
            deploy_vercel
            ;;
        docker)
            deploy_docker
            ;;
        railway)
            deploy_railway
            ;;
        *)
            echo "Unknown target: $DEPLOY_TARGET"
            echo "Usage: ./deploy.sh [vercel|docker|railway]"
            exit 1
            ;;
    esac
    
    echo ""
    echo "============================================"
    echo "  DEPLOYMENT COMPLETE"
    echo "============================================"
    echo ""
    echo "Next steps:"
    echo "  1. Configure DNS for your domain"
    echo "  2. Set up SSL certificates (auto with Vercel/Netlify)"
    echo "  3. Configure Clerk webhooks"
    echo "  4. Set up monitoring (Sentry, UptimeRobot)"
    echo "  4. Submit mobile apps to stores"
}

main "$@"