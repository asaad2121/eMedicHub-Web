# -----------------------------
# Angular Deploy Script (Windows)
# Requires: CLOUDFRONT_DIST_ID and DIST_FOLDER environment variables
# -----------------------------

# Exit on error
$ErrorActionPreference = "Stop"

# Check required environment variables
if (-not $env:CLOUDFRONT_DIST_ID) {
    Write-Error "CLOUDFRONT_DIST_ID is not set."
    exit 1
}

if (-not $env:DIST_FOLDER) {
    Write-Error "DIST_FOLDER is not set."
    exit 1
}

$DistId = $env:CLOUDFRONT_DIST_ID
$DistFolder = $env:DIST_FOLDER

# Build Angular
Write-Host "Building Angular..."
npx ng build --configuration production

# Sync to S3
Write-Host "Syncing to S3..."
aws s3 sync $DistFolder s3://emedichub-angular-bucket --delete

# Invalidate CloudFront
Write-Host "Creating CloudFront invalidation..."
aws cloudfront create-invalidation --distribution-id $DistId --paths "/*"

Write-Host "Deployment completed! CloudFront distribution: $DistId"
