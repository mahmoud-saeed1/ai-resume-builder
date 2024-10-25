import Input from '@/ui/Input'
import Label from '@/ui/Label'

// form inputs interface
interface IFormInputs {
  placeholder: string
  name: string
  resumeInfo: any
  errors: any
  register: any
  handleInputChange: any
}

const FormInputs = () => {
  return (
    <div>
      <Label>{placeholder}</Label>
      <Input
        type="text"
        placeholder={placeholder}
        {...register(name)}
        onChange={handleInputChange}
        defaultValue={resumeInfo?.personalData[name]}
      />
      {errors[name] && <InputErrorMessage msg={errors[name].message} />}
    </div>
  )
}

export default FormInputs