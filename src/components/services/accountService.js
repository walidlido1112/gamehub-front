import axios from 'axios';
import { apiUrl } from '../../config'; // استيراد apiUrl

/**
 * جلب جميع الحسابات من الخادم.
 * @returns {Promise<Array>} قائمة الحسابات.
 * @throws {Error} في حالة حدوث خطأ أثناء جلب البيانات.
 */
export const fetchAccounts = async () => {
  try {
    // جلب البيانات من الخادم
    const response = await axios.get(`${apiUrl}/accounts`); // تأكد من إضافة المسار الصحيح
    return response.data;
  } catch (error) {
    // تسجيل الخطأ في وحدة التحكم
    console.error('Error fetching accounts:', error.response?.data || error.message);
    
    // رمي خطأ جديد مع رسالة مخصصة
    throw new Error('فشل في جلب الحسابات: ' + (error.response?.data?.message || error.message));
  }
};
