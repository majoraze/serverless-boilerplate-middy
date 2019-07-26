fileType=json
stage=$1
region=$2
outputFileName="./documentation/documentation.json"
APPLICATION_NAME="$1-$3"
restid=`aws apigateway get-rest-apis --output=$fileType --region=$region | APPLICATION_NAME=$APPLICATION_NAME node ./documentation/extract-api.js`

aws apigateway get-export \
  --rest-api-id=$restid \
  --stage-name=$stage \
  --export-type=swagger \
  --accept=application/$fileType \
  --region=$region \
  $outputFileName

node ./documentation/extract-option.js

# Pretty Swag UI
# npx pretty-swag -i documentation/documentation.json -o documentation/index.html

# ReDoc UI
npx redoc-cli bundle -o documentation/index.html documentation/documentation.json

# Spectacle UI
# npm install -f spectacle-docs
# spectacle -d documentation/documentation.json -t documentation/index.html


# aws s3 cp ./documentation s3://documentation-serverless-api/ --recursive --exclude "*" --include "*.html"