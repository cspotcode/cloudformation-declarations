
import {AWS, Template} from '../';
const template: Template = {
    // TODO
    Resources: {
        loadBalancer: AWS.ElasticLoadBalancing.LoadBalancer({
            Properties: {
                Listeners: []
            }
        })
    }
}
