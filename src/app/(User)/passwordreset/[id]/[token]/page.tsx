import PasswordChangeForm from "../../PasswordChangeForm";

type Props={}

function page({params}:{params: {id: string, token: string}}){
        const {id, token} = params;
    return (
        <div>
            <PasswordChangeForm id={id} token={token}/>
        </div>
    )
}

export default page;