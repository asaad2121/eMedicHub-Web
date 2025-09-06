#!/bin/bash
# -----------------------------
# Angular Deploy Script (Mac/Linux)
# Requires: CLOUDFRONT_DIST_ID and DIST_FOLDER environment variables
# -----------------------------

# Exit on error
set -e

# Check required environment variables
if [ -z "$CLOUDFRONT_DIST_ID" ]; then
  echo "Error: CLOUDFRONT_DIST_ID is not set."
  exit 1
fi

if [ -z "$DIST_FOLDER" ]; then
  echo "Error: DIST_FOLDER is not set."
  exit 1
fi

# Build Angular
echo "Building Angular..."
npx ng build --configuration production

# Sync to S3
echo "Syncing to S3..."
aws s3 sync "$DIST_FOLDER" s3://emedichub-angular-bucket --delete

# Invalidate CloudFront
echo "Creating CloudFront invalidation..."
aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DIST_ID" --paths "/*"

echo "Deployment completed! CloudFront distribution: $CLOUDFRONT_DIST_ID"
