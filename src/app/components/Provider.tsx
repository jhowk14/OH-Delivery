import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const Provider = ({children, params }: {children: React.ReactNode, params: { link: string }}) => {
    const token = cookies().get('token');
    if(!token) {
        redirect(`/${params.link}`)
    }

  return (
    <>
      {children}
    </>
  );
}

export default Provider;
