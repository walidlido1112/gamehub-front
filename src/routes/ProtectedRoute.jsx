import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { apiUrl } from '../config'; // تأكد من استيراد apiUrl من config.js

const ProtectedRoute = ({ children, role }) => {
  const { user, setUser, loading, setLoading } = useAuth();
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // التحقق من صحة التوكن مع الخادم
          const response = await axios.get(`${apiUrl}/auth/login`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            // إذا كان التوكن صالحًا، قم بتحديث حالة المستخدم
            setUser(response.data.user);
          } else {
            // إذا لم يكن التوكن صالحًا، قم بإزالة التوكن وارجع إلى صفحة تسجيل الدخول
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          // في حالة حدوث خطأ، قم بإزالة التوكن وارجع إلى صفحة تسجيل الدخول
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoadingAuth(false);
    };

    checkAuth();
  }, [setUser]);

  if (loading || loadingAuth) {
    return <div>Loading...</div>; // أو يمكنك عرض عنصر تحميل آخر
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
