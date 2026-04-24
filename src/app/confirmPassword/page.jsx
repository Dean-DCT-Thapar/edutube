'use client'
import { useEffect , useState } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/utils/apiClient';
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
        apiClient.get('/api/verify-auth'),
        apiClient.get('/api/get-user-data')
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
      toast.error('New Password must be at least 6 characters long.');
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

      const response = await apiClient.post('/api/change-password', {
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
    const minLength = 6;
    return password.length > minLength;
  };

  const handleClick = (e) => {
    e.preventDefault();
    const oldPass = document.querySelector('#oldPassword').value;
    const newPass = document.querySelector('#newPassword').value;
    const confirmPass = document.querySelector('#confirmPassword').value;

    if (!validateNewPassword(newPass)) {
      alert('New Password must be at least 6 characters long.');
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TopBar name={userData?.name} />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
          <div className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {userData?.name || 'User'}
                  </h1>
                  <p className="text-gray-600 text-lg">{userData?.email}</p>
                </div>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Display */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100">
                  <label className="text-sm font-medium text-gray-700 mb-1 sm:mb-0">
                    Username:
                  </label>
                  <span className="text-gray-900 font-medium">{userData?.email}</span>
                </div>

                {/* Old Password */}
                <div className="space-y-2">
                  <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    required
                    value={formValues.oldPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your current password"
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={formValues.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter your new password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formValues.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Confirm your new password"
                  />
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Must be more than 6 characters long</li>
                  </ul>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default page


