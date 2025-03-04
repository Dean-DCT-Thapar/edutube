'use client'
import { useEffect , useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import SideBar from '../component/SideBar'
import TopBar from '../component/TopBar'
import Footer from '../component/Footer'

const page = () => {

  const router = useRouter();

  const [userData, setUserData] = useState(null);

  const [formValues, setFormValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const loadingToast = toast.loading('Loading...', { id: 'dashboard-loading' });

    Promise.all([
        axios.get('/api/verify-auth'),
        axios.get('/api/get-user-data')
    ])
        .then(([authResponse, userDataResponse]) => {
            if (authResponse.data.status === 200) {
                if (authResponse.data.role !== 'student') {
                    throw new Error('Access denied. Students only.');
                }
                toast.dismiss(loadingToast);
                setUserData(userDataResponse.data);
            } else {
                throw new Error('Authentication failed');
            }
        })
        .catch((error) => {
            const errorMessage = error.response?.data?.message || error.message || 'Please login to continue';
            toast.error(errorMessage, {id: loadingToast});
            router.push('/login');
        });
  }, [router]);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    //Validate new password
    if (!validateNewPassword(formValues.newPassword)) {
      toast.error('New Password must have at least 8 characters, 1 digit, 1 lowercase letter, 1 uppercase letter, and 1 special character.');
      return;
    }

    try {
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

  const validateNewPassword = (password) => {
    const minLength = 8;
    const hasDigit = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      password.length >= minLength &&
      hasDigit &&
      hasLowercase &&
      hasUppercase &&
      hasSpecialChar
    );
  };

  const handleClick = (e) => {
    e.preventDefault();
    const oldPass = document.querySelector('#oldPassword').value;
    const newPass = document.querySelector('#newPassword').value;
    const confirmPass = document.querySelector('#confirmPassword').value;

    if (!validateNewPassword(newPass)) {
      alert('New Password must have at least 8 characters, 1 digit, 1 lowercase letter, 1 uppercase letter, and 1 special character.');
      return;
    }

    if (checkOldPassword(oldPass)) {
      if (newPass === confirmPass) {
        alert('Password Changed Successfully');
        console.log(oldPass, newPass, confirmPass);
        window.location.reload();
      } else {
        alert('Passwords do not match');
      }
    } else {
      alert('Old Password is Incorrect');
    }
  };

  const checkOldPassword = (oldPassword) => {
    return oldPassword === '123456';
  };

  return (
    <div>
      <TopBar name={userData?.name} />
      <SideBar />
      <main className='pt-15'>
        <div className='flex flex-row sm:ml-44 ml-20 -z-10 w-4/5'>
          <img src='profile.png' className='rounded-full h-24 sm:h-44' />
          <div className='text-[#102c57] ml-5 my-auto text-xl sm:text-3xl font-poppins'>
            {userData?.name}<br />
            ROLL NUMBER ENDPOINT
          </div>
        </div>
        <div className='border-[#102c57] text-[#102c57] border-1.5 p-3 mt-5 mb-10 sm:ml-44 ml-4.5 -z-10 w-4/5'>
          <p className='text-xl sm:text-3xl font-poppins'>Change Password</p>
          <form className='mt-5' onSubmit={handleSubmit}>
            <div className='flex flex-row text-lg sm:text-2xl sm:justify-between mx-5'>
              <p>Username:</p>
              <p>{userData?.email}</p>
            </div>
            <div className='flex flex-row mt-4 text-lg sm:text-2xl justify-between mx-5'>
              <p>Old Password:</p>
              <input required name='oldPassword' value={formValues.oldPassword} onChange={handleChange} type='password' className='border-1 border-[#102c57] w-24 h-7 sm:h-10 sm:w-72' id='oldPassword' />
            </div>
            <div className='flex flex-row mt-4 text-lg sm:text-2xl justify-between mx-5'>
              <p>New Password:</p>
              <input required name='newPassword' value={formValues.newPassword} onChange={handleChange} type='password' className='border-1 border-[#102c57] w-24 h-7 sm:h-10 sm:w-72' id='newPassword'></input>
            </div>
            <div className='flex flex-row mt-4 text-lg sm:text-2xl justify-between mx-5'>
              <p>Confirm Password:</p>
              <input required name='confirmPassword' value={formValues.confirmPassword} onChange={handleChange} type='password' className='border-1 border-[#102c57] w-24 h-7 sm:h-10 sm:w-72' id='confirmPassword'></input>
            </div>
            <p className='text-black text-sm text-center mt-2'>The password must have at least 8 characters, at least 1 digit(s), at least 1 lowercase letter, at least 1 uppercase letter, and at least 1 special character.</p>
            <div className='flex flex-row justify-center mt-5'>
              <button type='submit' className='bg-[#b42625] text-white font-poppins text-sm sm:text-xl px-0.128  sm:px-5 sm:py-2 w-52 mr-5'>Save Changes</button>
              <button type='button' onClick={() => router.push("/dashboard")} className='bg-[#102c57] text-white font-poppins text-sm sm:text-xl sm:px-5 sm:py-2 h-7 sm:h-12 w-52'>Cancel</button>
            </div>
          </form>
        </div>
        <Footer style={{width: '100%'}}/>
      </main>
    </div>
  )
}

export default page


