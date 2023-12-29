import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailsForm from "./detailsForm";
import PasswordForm from "./passwordForm";


type Props = {}

function AccountTabs(props: Props) {

    return (
        <div className="mt-4 max-w-[1280px] mx-auto">
            <Tabs defaultValue="account" className="w-[600px] mx-auto p-5">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">
                    <DetailsForm/>
                </TabsContent>
                <TabsContent value="password">
                    <PasswordForm/>
                </TabsContent>
            </Tabs>
        </div>
    )
}
export default AccountTabs;