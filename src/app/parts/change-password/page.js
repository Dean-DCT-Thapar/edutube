'use client';
import { useEffect  , useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ChangePassword() {

    const router = useRouter();

    const [formValues, setFormValues] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{

            if(formValues.newPassword !== formValues.confirmPassword){
                toast.error("New password and confirm password do not match");
                setFormValues({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                return;
            }else if(formValues.newPassword.length < 8){
                toast.error("New password must be at least 8 characters long");
                setFormValues({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                return;
            }else if(formValues.currentPassword === formValues.newPassword){
                toast.error("New password and current password cannot be the same");
                setFormValues({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                return;
            }

            const response = await axios.post('/api/change-password', {
                currentPassword: formValues.currentPassword,
                newPassword: formValues.newPassword,
            });
            
            toast.success(response.data.message);
            router.push('/dashboard');
            
        }catch(error){
            if(error.response){
                toast.error(error.response.data.message);
                setFormValues({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }else{
                toast.error(error.message);
                router.push('/dashboard');
            }
        }
    }

    return (
        <div>
            <img className="h-screen w-screen absolute sm:hidden block" src="/hostelMphone.jpg" alt="Hostel" />
            <img className="h-screen w-screen absolute sm:block hidden" src="/mHostel.jpg" alt="Hostel" />
            <div className="bg-[#ededed] shadow-2xl shadow-black opacity-95 border-black rounded-xl h-2/3 pb-8 sm:w-1/3 w-2/3 mx-auto sm:top-55 top-32 relative">
                <h1 className="text-black font-sans text-center font-semibold text-3xl mt-4">Change Password</h1>
                <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                    <div className="flex flex-col">
                        <label className="text-black font-sans w-2/3 mx-auto font-semibold text-lg">Current Password</label>
                        <input
                            required
                            className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
                            placeholder="Current Password"
                            type="password"
                            name="currentPassword"
                            value={formValues.currentPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex flex-col mt-5">
                        <label className="text-black font-sans w-2/3 mx-auto font-semibold text-lg">New Password</label>
                        <input
                            required
                            className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
                            placeholder="New Password"
                            type="password"
                            name="newPassword"
                            value={formValues.newPassword}
                            onChange={handleChange}
                            />
                    </div>
                    <div className="flex flex-col mt-5">
                        <label className="text-black font-sans w-2/3 mx-auto font-semibold text-lg">Confirm New Password</label>
                        <input
                            required
                            className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
                            placeholder="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button type='submit' className='text-white bg-[#b95454] border-2 border-[#b95454] rounded-xl w-2/3 mx-auto mt-5 py-1 hover:bg-[#ededed] hover:text-black hover:ease-linear duration-75'>
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    )
}