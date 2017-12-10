# TypeScript declarations for CloudFormation (WIP)

TypeScript declarations for writing CloudFormation stack templates, automatically generated from Amazon's specification files.

*Subject to change while I tweak things and figure out a workflow that I like; still a work-in-progress.*

Write your CloudFormation stack template in JavaScript or TypeScript with full IntelliSense from these declarations.
Then `JSON.stringify()` the result to a `.json` file.

## Usage:

Import this module and it'll give you all the helpers and interfaces.

For example:

```typescript
import {AWS, Template} from 'cloudformation-declarations';
const template: Template = {
    Resources: {
        loadBalancer: AWS.ElasticLoadBalancing.LoadBalancer({
            Properties: {
                Listeners: /*...*/
            }
        })
    }
}
```

# To rebuild

(optional) Download up-to-date resource specifications from Amazon.

http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html

Or a direct link to the .json file: https://d1uauaxba7bl26.cloudfront.net/latest/gzip/CloudFormationResourceSpecification.json

Then run the generator script (You'll need node and NPM installed, and do an `npm install` first)

```
npm run generate
```
