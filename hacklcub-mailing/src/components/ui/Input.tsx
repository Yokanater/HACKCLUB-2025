
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export default function Input({className, ...props}: InputProps)  {
  return <input className={`bg-[#fff] h-[50px] rounded-[10px] border-[#00000050] border-[2px] outline-none ${className}`} {...props}/>
}
