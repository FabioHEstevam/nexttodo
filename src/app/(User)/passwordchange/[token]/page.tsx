import PasswordChangeForm from "../PasswordChangeForm";

type Props={}

function page({params}:{params: {token: string}}){
        const token = params.token;
    return (
        <div>
            <PasswordChangeForm token={token}/>
        </div>
    )
}

export default page;