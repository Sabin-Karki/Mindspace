import { useForm, type SubmitHandler } from "react-hook-form";
import {type  UserType } from "./data.schema";


const sigin = () =>{

  const {register, handleSubmit, formState: { errors } } = useForm<UserType>();
  const onSubmit: SubmitHandler<UserType> = (data) => {
      console.log(data);
  }

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} >
      <input {...register("username")}/>
      <input {...register("email")}/>
      {errors.email && <span>email is required</span>}
      <input {...register("password")} />
      <input type="submit" />
    </form>
    </>
  )
}

export default sigin;