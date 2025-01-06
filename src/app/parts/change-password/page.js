'use client';
import { useEffect  , useState} from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ChangePassword() {

    const router = useRouter();

    const [formValues, setFormValues] = useState({
        oldPassword: '',
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
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                return;
            }

            const response = await axios.post('/api/change-password', {
                oldPassword: formValues.oldPassword,
                newPassword: formValues.newPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            
            toast.success("Password changed successfully");
            router.push('/dashboard');

        }catch(error){
            if(error.response.data.status === 401){
                toast.error("Invalid current password");
                setFormValues({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }else{
                toast.error("There was an error changing your password");
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
                        <label className="text-black font-sans w-2/3 mx-auto font-semibold text-lg">Old Password</label>
                        <input
                            required
                            className="w-2/3 mx-auto bg-[#ededed] border-2 border-[#b95454] rounded-xl focus:outline-[#974545] text-black py-1 px-2"
                            placeholder="Old Password"
                            type="password"
                            name="oldPassword"
                            value={formValues.oldPassword}
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