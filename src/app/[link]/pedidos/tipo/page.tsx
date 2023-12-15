'use client'
import { useRouter } from "next/navigation";
import { useGrupoTipo } from "@/app/states/grupo/useGrupoTipo";
import { useGrupo } from "@/app/states/grupo/useGrupo";
import { BiArrowBack } from "react-icons/bi";
import { useEffect } from "react";
// @ts-ignore
import { MotionAnimate } from 'react-motion-animate'
import { useEmpresaStore } from "@/app/states/empresa/useEmpresa";
import { GrupoTipo as GrupoTipos } from "../../../../../types/GrupoTipo";

const GrupoTipo = ({ params }: { params: { link: string } }) => {
  const route = useRouter();
  const grupos = useGrupo.getState().state.grupo

  useEffect(()=>{
    if(!grupos){
      route.push(`/${params.link}/pedidos/`)
    }
  },[grupos, route, params])
  const grupoTipos: GrupoTipos[] | undefined = grupos?.GrupoTipo;

  const handleGrupoSelection = (grupo: GrupoTipos) => {
    useGrupoTipo.getState().actions.addEmpresa(grupo)
    route.push(`/${params.link}/pedidos/${grupos?.GrupID}`)
  };

  return (<>
  <MotionAnimate>

            <div className="mt-3 lg:mx-20">
            <button onClick={()=> {
            route.push(`/${params.link}/pedidos`)
            useGrupoTipo.getState().actions.addEmpresa(null)
            }} className="p-3 bg-gray-300 mx-6 font-bold rounded-full focus:outline-none transition-transform transform hover:scale-125">
            <BiArrowBack/>
            </button>
            </div>
          <div className="p-6">
            <h3 className="font-bold text-lg flex gap-2 bg-gray-800 px-3 py-1 mt-1 w-full justify-center rounded-xl text-gray-100 items-center mb-10">{grupos?.GrupDescricao}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {grupoTipos?.map((grupo) => (
                <div key={grupo.GrTpID} className="">
                  <button
                  style={{backgroundColor: useEmpresaStore.getState().empresa?.CorSite}}
                  className="p-4 w-full rounded-lg text-gray-100 shadow-md shadow-gray-500 bg-gray-500 focus:outline-none transition-transform transform hover:scale-105"
                  onClick={() => handleGrupoSelection(grupo)}
                  >
                    {grupo.GrTpDescricao} até {grupo.GrTpDivisao} sabores
                  </button>
                </div>
              ))}
            </div>
          </div>
  </MotionAnimate>
          </>);
};
export default GrupoTipo