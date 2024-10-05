

const Loader = ({dark,sm}:{dark?:boolean,sm?:boolean}) => {
  return (
    <div className="flex justify-center items-center">
                    <div className={`animate-spin rounded-full ${sm?" h-4 w-4":"h-8 w-8"} border-b-2 ${dark?"border-slate-800":"border-white"} `}></div>
                  </div>
  )
}

export default Loader