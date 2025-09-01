// import React, { useState } from 'react';
// import { captureStudentDetails, authenticateUser } from "../service/StudentService";
// import { useNavigate } from "react-router-dom";

// const SignUp = () => {
//   const [activeTab, setActiveTab] = useState("login");
//   const [isLoading, setIsLoading] = useState(false);

//   // Login form state
//   const [credentials, setCredentials] = useState({ 
//     email: "", 
//     password: "" 
//   });

//   // Signup form state
//   const [signupForm, setSignupForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     course: "",
//     yearLevel: "",
//   });

//   const [errors, setErrors] = useState({
//     email: "",
//     passwordMatch: "",
//     form: ""
//   });

//   const navigate = useNavigate();

//   const validateEmail = (email) => email.endsWith("@mycput.ac.za");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     try {
//       const response = await authenticateUser(credentials.email, credentials.password);

//       if (response.data.success) {
//         const student = response.data.student;
//         alert(`Welcome back, ${student.firstName}!`);
//         navigate("/studentDashboard", { state: { student } });
//       } else {
//         alert(response.data.message || "Login failed. Check your credentials.");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Login failed. Try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrors({ email: "", passwordMatch: "", form: "" });

//     if (!validateEmail(signupForm.email)) {
//       setErrors(prev => ({ ...prev, email: "Email must end with @mycput.ac.za" }));
//       setIsLoading(false);
//       return;
//     }

//     if (signupForm.password !== signupForm.confirmPassword) {
//       setErrors(prev => ({ ...prev, passwordMatch: "Passwords do not match" }));
//       setIsLoading(false);
//       return;
//     }

//     const requiredFields = ['firstName','lastName','email','password','confirmPassword','course','yearLevel'];
//     const missingFields = requiredFields.filter(f => !signupForm[f]);
//     if (missingFields.length > 0) {
//       setErrors(prev => ({ ...prev, form: "Please fill in all required fields" }));
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const studentData = { ...signupForm };
//       delete studentData.confirmPassword;

//       const response = await captureStudentDetails(studentData);
//       if (response.status === 201) {
//         alert("Registration successful! Please login.");
//         setActiveTab("login");
//         setSignupForm({
//           firstName: "", lastName: "", email: "", password: "", confirmPassword: "", course: "", yearLevel: ""
//         });
//       } else {
//         alert(response.data?.message || "Registration failed.");
//       }
//     } catch (error) {
//       alert(error.response?.data?.message || "Registration failed.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#f8f9fa' }}>
//       <div style={{ width:'100%', padding:'1rem', maxWidth:'400px' }}>
//         {/* Header */}
//         <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
//           <div style={{ marginBottom:'1rem' }}>
//             <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', borderRadius:'16px', marginBottom:'0.75rem', width:'64px', height:'64px', backgroundColor:'#4285f4' }}>
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color:'white' }} strokeWidth="2">
//                 <path d="M22 10v6M2 10l10-5 10 5-10 5"/>
//                 <path d="M6 12v5c3 3 9 3 12 0v-5"/>
//               </svg>
//             </div>
//           </div>
//           <h1 style={{ fontSize:'1.5rem', fontWeight:'bold', marginBottom:'0.5rem', color:'#4285f4' }}>Student Tracker</h1>
//           <p style={{ fontSize:'0.875rem', color:'#6c757d' }}>Your academic journey, simplified</p>
//         </div>

//         {/* Tabs */}
//         <div style={{ display:'flex', marginBottom:'0', borderRadius:'8px', overflow:'hidden' }}>
//           <button onClick={() => setActiveTab("login")} style={{
//             flex:1, padding:'0.75rem 1rem', textAlign:'center', fontWeight:'500',
//             color: activeTab==='login'?'white':'#4a5568', backgroundColor: activeTab==='login'?'#4285f4':'#e9ecef',
//             borderTopLeftRadius:'8px', borderBottomLeftRadius: activeTab==='login'?'0':'8px', border:'none', cursor:'pointer'
//           }}>Login</button>
//           <button onClick={() => setActiveTab("signup")} style={{
//             flex:1, padding:'0.75rem 1rem', textAlign:'center', fontWeight:'500',
//             color: activeTab==='signup'?'white':'#4a5568', backgroundColor: activeTab==='signup'?'#4285f4':'#e9ecef',
//             borderTopRightRadius:'8px', borderBottomRightRadius: activeTab==='signup'?'0':'8px', border:'none', cursor:'pointer'
//           }}>Sign Up</button>
//         </div>

//         {/* Content */}
//         <div style={{
//           backgroundColor:'white', padding:'1.5rem', boxShadow:'0 1px 2px 0 rgba(0,0,0,0.05)',
//           borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px',
//           borderTopLeftRadius: activeTab==='login'?'0':'8px', borderTopRightRadius: activeTab==='signup'?'0':'8px',
//           border:'1px solid #dee2e6'
//         }}>
//           {activeTab==='login' && (
//             <div style={{ display:'grid', gap:'1rem' }}>
//               <input type="email" placeholder="student@mycput.ac.za" value={credentials.email} onChange={e=>setCredentials({...credentials,email:e.target.value})} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }} required/>
//               <input type="password" placeholder="Password" value={credentials.password} onChange={e=>setCredentials({...credentials,password:e.target.value})} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }} required/>
//               <button onClick={handleLogin} disabled={isLoading} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.5rem', color:'white', fontWeight:'500', backgroundColor:isLoading?'#87ceeb':'#4285f4', border:'none', cursor:isLoading?'not-allowed':'pointer' }}>
//                 {isLoading?'Signing In...':'Sign In'}
//               </button>
//             </div>
//           )}

//           {activeTab==='signup' && (
//             <div style={{ display:'grid', gap:'1rem' }}>
//               {/* First & Last Name */}
//               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
//                 <input type="text" placeholder="First Name" value={signupForm.firstName} onChange={e=>setSignupForm({...signupForm,firstName:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
//                 <input type="text" placeholder="Last Name" value={signupForm.lastName} onChange={e=>setSignupForm({...signupForm,lastName:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
//               </div>
//               {/* Email */}
//               <input type="email" placeholder="student@mycput.ac.za" value={signupForm.email} onChange={e=>setSignupForm({...signupForm,email:e.target.value})} style={{ padding:'0.5rem', border:`1px solid ${errors.email?'#dc3545':'#ced4da'}`, borderRadius:'0.5rem' }} onBlur={()=>{ if(signupForm.email && !validateEmail(signupForm.email)){setErrors(prev=>({...prev,email:"Email must end with @mycput.ac.za"}))} else {setErrors(prev=>({...prev,email:""}))}}}/>
//               {errors.email && <div style={{ color:'#dc3545', fontSize:'0.75rem' }}>{errors.email}</div>}
//               {/* Passwords */}
//               <input type="password" placeholder="Password" value={signupForm.password} onChange={e=>setSignupForm({...signupForm,password:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
//               <input type="password" placeholder="Confirm Password" value={signupForm.confirmPassword} onChange={e=>setSignupForm({...signupForm,confirmPassword:e.target.value})} style={{ padding:'0.5rem', border:`1px solid ${errors.passwordMatch?'#dc3545':'#ced4da'}`, borderRadius:'0.5rem' }} onBlur={()=>{ if(signupForm.password!==signupForm.confirmPassword && signupForm.confirmPassword){setErrors(prev=>({...prev,passwordMatch:"Passwords do not match"}))} else {setErrors(prev=>({...prev,passwordMatch:""}))}}}/>
//               {errors.passwordMatch && <div style={{ color:'#dc3545', fontSize:'0.75rem' }}>{errors.passwordMatch}</div>}
//               {/* Course & Year */}
//               <input type="text" placeholder="Course Name" value={signupForm.course} onChange={e=>setSignupForm({...signupForm,course:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
//               <select value={signupForm.yearLevel} onChange={e=>setSignupForm({...signupForm,yearLevel:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}>
//                 <option value="">Select Year Level</option>
//                 <option value="1st-year">1st Year</option>
//                 <option value="2nd-year">2nd Year</option>
//                 <option value="3rd-year">3rd Year</option>
//                 <option value="4th-year">4th Year</option>
//                 <option value="5th-year">5th Year</option>
//                 <option value="graduate">Graduate</option>
//               </select>
//               {/* Submit */}
//               <button onClick={handleSignup} disabled={isLoading} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.5rem', color:'white', fontWeight:'500', backgroundColor:isLoading?'#87ceeb':'#4285f4', border:'none', cursor:isLoading?'not-allowed':'pointer' }}>
//                 {isLoading?'Creating Account...':'Create Account'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import React, { useState } from 'react';
import { captureStudentDetails, authenticateUser } from "../service/StudentService";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [credentials, setCredentials] = useState({ 
    email: "", 
    password: "" 
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    course: "",
    yearLevel: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    passwordMatch: "",
    form: ""
  });

  const navigate = useNavigate();

  const validateEmail = (email) => email.endsWith("@mycput.ac.za");

  // ✅ Updated: handle both admin + student login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authenticateUser(credentials.email, credentials.password);

      if (response.data.success) {
        if (response.data.role === "admin") {
          const admin = response.data.admin;
          localStorage.setItem("adminToken", JSON.stringify(admin));
          alert(`Welcome Admin, ${admin.username}!`);
          navigate("/admindashboard");
        } else {
          const student = response.data.student;
          localStorage.setItem("studentToken", JSON.stringify(student));
          alert(`Welcome back, ${student.firstName}!`);
          navigate("/studentDashboard", { state: { student } });
        }
      } else {
        alert(response.data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", passwordMatch: "", form: "" });

    if (!validateEmail(signupForm.email)) {
      setErrors(prev => ({ ...prev, email: "Email must end with @mycput.ac.za" }));
      setIsLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrors(prev => ({ ...prev, passwordMatch: "Passwords do not match" }));
      setIsLoading(false);
      return;
    }

    const requiredFields = ['firstName','lastName','email','password','confirmPassword','course','yearLevel'];
    const missingFields = requiredFields.filter(f => !signupForm[f]);
    if (missingFields.length > 0) {
      setErrors(prev => ({ ...prev, form: "Please fill in all required fields" }));
      setIsLoading(false);
      return;
    }

    try {
      const studentData = { ...signupForm };
      delete studentData.confirmPassword;

      const response = await captureStudentDetails(studentData);
      if (response.status === 201) {
        alert("Registration successful! Please login.");
        setActiveTab("login");
        setSignupForm({
          firstName: "", lastName: "", email: "", password: "", confirmPassword: "", course: "", yearLevel: ""
        });
      } else {
        alert(response.data?.message || "Registration failed.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#f8f9fa' }}>
      <div style={{ width:'100%', padding:'1rem', maxWidth:'400px' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ marginBottom:'1rem' }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', borderRadius:'16px', marginBottom:'0.75rem', width:'64px', height:'64px', backgroundColor:'#4285f4' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ color:'white' }} strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
          </div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:'bold', marginBottom:'0.5rem', color:'#4285f4' }}>Student Tracker</h1>
          <p style={{ fontSize:'0.875rem', color:'#6c757d' }}>Your academic journey, simplified</p>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', marginBottom:'0', borderRadius:'8px', overflow:'hidden' }}>
          <button onClick={() => setActiveTab("login")} style={{
            flex:1, padding:'0.75rem 1rem', textAlign:'center', fontWeight:'500',
            color: activeTab==='login'?'white':'#4a5568', backgroundColor: activeTab==='login'?'#4285f4':'#e9ecef',
            borderTopLeftRadius:'8px', borderBottomLeftRadius: activeTab==='login'?'0':'8px', border:'none', cursor:'pointer'
          }}>Login</button>
          <button onClick={() => setActiveTab("signup")} style={{
            flex:1, padding:'0.75rem 1rem', textAlign:'center', fontWeight:'500',
            color: activeTab==='signup'?'white':'#4a5568', backgroundColor: activeTab==='signup'?'#4285f4':'#e9ecef',
            borderTopRightRadius:'8px', borderBottomRightRadius: activeTab==='signup'?'0':'8px', border:'none', cursor:'pointer'
          }}>Sign Up</button>
        </div>

        {/* Content */}
        <div style={{
          backgroundColor:'white', padding:'1.5rem', boxShadow:'0 1px 2px 0 rgba(0,0,0,0.05)',
          borderBottomLeftRadius:'8px', borderBottomRightRadius:'8px',
          borderTopLeftRadius: activeTab==='login'?'0':'8px', borderTopRightRadius: activeTab==='signup'?'0':'8px',
          border:'1px solid #dee2e6'
        }}>
          {activeTab==='login' && (
            <div style={{ display:'grid', gap:'1rem' }}>
              <input type="email" placeholder="student@mycput.ac.za" value={credentials.email} onChange={e=>setCredentials({...credentials,email:e.target.value})} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }} required/>
              <input type="password" placeholder="Password" value={credentials.password} onChange={e=>setCredentials({...credentials,password:e.target.value})} style={{ width:'100%', padding:'0.75rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }} required/>
              <button onClick={handleLogin} disabled={isLoading} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.5rem', color:'white', fontWeight:'500', backgroundColor:isLoading?'#87ceeb':'#4285f4', border:'none', cursor:isLoading?'not-allowed':'pointer' }}>
                {isLoading?'Signing In...':'Sign In'}
              </button>
            </div>
          )}

          {activeTab==='signup' && (
            <div style={{ display:'grid', gap:'1rem' }}>
              {/* First & Last Name */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                <input type="text" placeholder="First Name" value={signupForm.firstName} onChange={e=>setSignupForm({...signupForm,firstName:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
                <input type="text" placeholder="Last Name" value={signupForm.lastName} onChange={e=>setSignupForm({...signupForm,lastName:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
              </div>
              {/* Email */}
              <input type="email" placeholder="student@mycput.ac.za" value={signupForm.email} onChange={e=>setSignupForm({...signupForm,email:e.target.value})} style={{ padding:'0.5rem', border:`1px solid ${errors.email?'#dc3545':'#ced4da'}`, borderRadius:'0.5rem' }} onBlur={()=>{ if(signupForm.email && !validateEmail(signupForm.email)){setErrors(prev=>({...prev,email:"Email must end with @mycput.ac.za"}))} else {setErrors(prev=>({...prev,email:""}))}}}/>
              {errors.email && <div style={{ color:'#dc3545', fontSize:'0.75rem' }}>{errors.email}</div>}
              {/* Passwords */}
              <input type="password" placeholder="Password" value={signupForm.password} onChange={e=>setSignupForm({...signupForm,password:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
              <input type="password" placeholder="Confirm Password" value={signupForm.confirmPassword} onChange={e=>setSignupForm({...signupForm,confirmPassword:e.target.value})} style={{ padding:'0.5rem', border:`1px solid ${errors.passwordMatch?'#dc3545':'#ced4da'}`, borderRadius:'0.5rem' }} onBlur={()=>{ if(signupForm.password!==signupForm.confirmPassword && signupForm.confirmPassword){setErrors(prev=>({...prev,passwordMatch:"Passwords do not match"}))} else {setErrors(prev=>({...prev,passwordMatch:""}))}}}/>
              {errors.passwordMatch && <div style={{ color:'#dc3545', fontSize:'0.75rem' }}>{errors.passwordMatch}</div>}
              {/* Course & Year */}
              <input type="text" placeholder="Course Name" value={signupForm.course} onChange={e=>setSignupForm({...signupForm,course:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}/>
              <select value={signupForm.yearLevel} onChange={e=>setSignupForm({...signupForm,yearLevel:e.target.value})} style={{ padding:'0.5rem', border:'1px solid #ced4da', borderRadius:'0.5rem' }}>
                <option value="">Select Year Level</option>
                <option value="1st-year">1st Year</option>
                <option value="2nd-year">2nd Year</option>
                <option value="3rd-year">3rd Year</option>
                <option value="4th-year">4th Year</option>
                <option value="5th-year">5th Year</option>
                <option value="graduate">Graduate</option>
              </select>
              {/* Submit */}
              <button onClick={handleSignup} disabled={isLoading} style={{ width:'100%', padding:'0.75rem', borderRadius:'0.5rem', color:'white', fontWeight:'500', backgroundColor:isLoading?'#87ceeb':'#4285f4', border:'none', cursor:isLoading?'not-allowed':'pointer' }}>
                {isLoading?'Creating Account...':'Create Account'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;

