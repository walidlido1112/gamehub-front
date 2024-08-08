import axios from 'axios';

const API_URL = 'https://gamehub-backend-5c3f456a5ad4.herokuapp.com/api';

/**
 * جلب جميع الحسابات من الخادم.
 * @returns {Promise<Array>} قائمة الحسابات.
 * @throws {Error} في حالة حدوث خطأ أثناء جلب البيانات.
 */
export const fetchAccounts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    // يمكنك تسجيل الخطأ في وحدة التحكم للمراجعة أو التعامل معه بشكل أفضل
    console.error('Error fetching accounts:', error.response?.data || error.message);
    
    // throwing a new error to be handled by the caller
    throw new Error('فشل في جلب الأكوانتات: ' + (error.response?.data?.message || error.message));
  }
};
