
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({className, ...props}: InputProps)  {
  return <input className={`m-[0px] p-[12px] bg-[#fff] h-[50px] rounded-[10px] border-[#00000050] focus:border-[#3B82F6] border-[2px] outline-none ${className}`} {...props}/>
}
