import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { useToken } from "../states/carrinho/useToken";

const Provider = ({children, params }: {children: React.ReactNode, params: { link: string }}) => {
    const token = cookies().get('token');
    if(!token) {
        redirect(`/${params.link}`)
    }
    
    useToken.getState().setToken(token.value);
  return (
    <>
      {children}
    </>
  );
}

export default Provider;
