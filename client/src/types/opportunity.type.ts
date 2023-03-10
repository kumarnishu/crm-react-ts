import { IActivity } from "./activity.type";
import { Asset } from "./asset.type";
import { IOrganization } from "./organization.type";
import { IUser } from "./user.type";

type BaseOpportunity = {
    _id: string,
    name: string,
    customer_name: string,
    customer_designation: string,
    mobile: number
    email: string
    city: string,
    state: string,
    address: string,
    description: string,
     // for react table actions
     actions: any
}

type AdditionalData = {
    alternate_mobile: number,
    alternate_email: string,
    probability: "easy" | "medium" | "hard"
    opportunity_owner: IUser,
    organization: IOrganization
    dp: Asset
    opportunity_source: string,
    remarks: string,
    country: string
}
type Status = {
    status: Boolean,
    status_changed_by: IUser
    created_at: Date,
    updated_at: Date,
    updated_by: IUser
    activities: IActivity[]
}
export type IOpportunity = BaseOpportunity & AdditionalData & Status
export type TOpportunityBody = Request['body'] & IOpportunity;
