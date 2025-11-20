import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showFindIdModal, setShowFindIdModal] = useState(false);
  const [showFindPwModal, setShowFindPwModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const signupEmailRef = useRef(null);
  const signupPasswordRef = useRef(null);
  const signupConfirmPasswordRef = useRef(null);
  const findIdContactRef = useRef(null);
  const findPwUserIdRef = useRef(null);

  useEffect(() => {
    document.title = '로그인';
    
    // Kakao SDK 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('YOUR_JAVASCRIPT_KEY');
      }
    };

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loginWithKakao = () => {
    if (!window.Kakao) {
      showToast('카카오 SDK가 로드되지 않았습니다.');
      return;
    }

    window.Kakao.Auth.login({
      success: (authObj) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: (res) => {
            const userProfile = {
              id: res.id,
              nickname: res.properties.nickname,
              profileImage: res.properties.profile_image
            };
            handleLoginSuccess(userProfile);
          },
          fail: (error) => {
            handleLoginError('Failed to get user info');
          }
        });
      },
      fail: (err) => {
        handleLoginError('Failed to login with Kakao');
      }
    });
  };

  const loginWithGoogle = () => {
    setIsGoogleLoading(true);
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const clientId = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';
    const redirectUri = encodeURIComponent('https://your-domain.com/auth/google/callback');
    const scope = encodeURIComponent('email profile');
    const state = encodeURIComponent(Math.random().toString(36).substring(2));
    const nonce = encodeURIComponent(Math.random().toString(36).substring(2));

    const url = `${googleAuthUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&nonce=${nonce}&prompt=select_account`;

    setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  const loginWithNaver = () => {
    const naverAuthUrl = 'https://nid.naver.com/oauth2.0/authorize';
    const clientId = 'YOUR_NAVER_CLIENT_ID';
    const redirectUri = encodeURIComponent('YOUR_REDIRECT_URI');
    const state = Math.random().toString(36).substr(2, 11);
    const url = `${naverAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;
    window.location.href = url;
  };

  const loginWithEmail = () => {
    showToast('이메일 로그인 기능을 준비 중입니다.');
  };

  const handleSignup = () => {
    const email = signupEmailRef.current?.value;
    const password = signupPasswordRef.current?.value;
    const confirmPassword = signupConfirmPasswordRef.current?.value;

    if (!email || !password || !confirmPassword) {
      showToast('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다.');
      return;
    }

    showToast('회원가입이 완료되었습니다.');
    setShowSignupModal(false);
  };

  const handleFindId = () => {
    const contact = findIdContactRef.current?.value;
    if (!contact) {
      showToast('이메일 또는 전화번호를 입력해주세요.');
      return;
    }
    showToast('입력하신 연락처로 아이디 정보를 전송했습니다.');
    setShowFindIdModal(false);
  };

  const handleFindPw = () => {
    const userId = findPwUserIdRef.current?.value;
    if (!userId) {
      showToast('아이디를 입력해주세요.');
      return;
    }
    showToast('입력하신 아이디로 비밀번호 재설정 링크를 전송했습니다.');
    setShowFindPwModal(false);
  };

  const handleLoginSuccess = (profile) => {
    showToast(`Welcome, ${profile.nickname}!`);
    // 로그인 성공 후 리다이렉트 로직 추가
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleLoginError = (message) => {
    showToast(message);
  };

  return (
    <div className="min-h-[762px] mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <style>{`
        :where([class^="ri-"])::before {
          content: "\\f3c2";
        }
        .social-btn {
          transition: all 0.3s ease;
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .social-btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .logo-3d {
          filter: drop-shadow(2px 2px 4px rgba(74, 144, 226, 0.3)) drop-shadow(4px 4px 8px rgba(74, 144, 226, 0.2));
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }
        .logo-3d:hover {
          transform: translateZ(20px) rotateX(10deg);
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <main className="w-full min-h-screen flex flex-col items-center justify-start px-6 pt-24 pb-12 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=modern%20abstract%203d%20background%20with%20flowing%20gradients%20and%20geometric%20elements%2C%20soft%20pastel%20colors%2C%20premium%20luxury%20design%2C%20clean%20minimal%20style&width=375&height=762&seq=1&orientation=portrait')] opacity-40 bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
        <div className="w-full max-w-sm space-y-8 relative -mt-32" style={{ animation: 'fadeIn 1s ease-out' }}>
          <div className="text-center space-y-6 mb-24">
            <img
              src="./assets/i.webp"
              alt="Travel&Pet Logo"
              className="mx-auto w-96 h-96 object-contain mb-[-10rem] relative z-10"
              style={{ animationDelay: '0.2s' }}
            />
            <p className="text-sm text-gray-500 animate-in relative z-20" style={{ animationDelay: '0.6s' }}>
              로그인하여 서비스를 이용하세요
            </p>
          </div>
          <div className="space-y-4">
            <button
              className="social-btn w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#FEE500] !rounded-button shadow-lg hover:shadow-xl relative overflow-hidden"
              style={{ animationDelay: '0.8s' }}
              onClick={loginWithKakao}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-kakao-talk-fill text-black text-xl" />
              </div>
              <span className="text-black font-medium">카카오톡으로 로그인</span>
            </button>
            <button
              className="social-btn w-full flex items-center justify-center gap-3 px-6 py-4 bg-white !rounded-button border border-gray-200 shadow-lg hover:shadow-xl relative overflow-hidden"
              onClick={loginWithGoogle}
              disabled={isGoogleLoading}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-google-fill text-xl" />
              </div>
              <span className="text-gray-700 font-medium">Google로 로그인</span>
              {isGoogleLoading && (
                <div className="loading-spinner absolute right-4">
                  <i className="ri-loader-4-line animate-spin" />
                </div>
              )}
            </button>
            <button
              className="social-btn w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#03C75A] !rounded-button shadow-lg hover:shadow-xl relative overflow-hidden"
              onClick={loginWithNaver}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-checkbox-blank-circle-fill text-white text-xl" />
              </div>
              <span className="text-white font-medium">네이버로 로그인</span>
            </button>
            <button
              className="social-btn w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-600 !rounded-button shadow-lg hover:shadow-xl relative overflow-hidden"
              onClick={loginWithEmail}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <i className="ri-mail-line text-white text-xl" />
              </div>
              <span className="text-white font-medium">이메일로 로그인</span>
            </button>
          </div>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300" />
            <span className="flex-shrink px-4 text-gray-500 text-sm">또는</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          <div className="space-y-4">
            <button
              className="w-full px-6 py-3 text-white font-medium !rounded-button transition-colors"
              style={{ backgroundColor: '#10604c' }}
              onClick={() => setShowSignupModal(true)}
            >
              회원가입
            </button>
            <div className="flex justify-center gap-4 text-sm">
              <button
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={() => setShowFindIdModal(true)}
              >
                아이디 찾기
              </button>
              <span>•</span>
              <button
                className="text-gray-600 hover:text-primary transition-colors"
                onClick={() => setShowFindPwModal(true)}
              >
                비밀번호 찾기
              </button>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400">로그인함으로써 다음에 동의하게 됩니다.</p>
            <div className="flex justify-center gap-3 text-xs text-gray-500">
              <a href="#" className="hover:text-primary">
                서비스 약관
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary">
                개인정보 처리방침
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 회원가입 모달 */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] space-y-4">
            <h3 className="text-xl font-semibold text-center">회원가입</h3>
            <div className="space-y-3">
              <input
                ref={signupEmailRef}
                type="text"
                placeholder="이메일 또는 전화번호"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                ref={signupPasswordRef}
                type="password"
                placeholder="비밀번호"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                ref={signupConfirmPasswordRef}
                type="password"
                placeholder="비밀번호 확인"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
              onClick={handleSignup}
            >
              가입하기
            </button>
            <button
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={() => setShowSignupModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 아이디 찾기 모달 */}
      {showFindIdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] space-y-4">
            <h3 className="text-xl font-semibold text-center">아이디 찾기</h3>
            <input
              ref={findIdContactRef}
              type="text"
              placeholder="가입시 입력한 이메일 또는 전화번호"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
              onClick={handleFindId}
            >
              찾기
            </button>
            <button
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={() => setShowFindIdModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 비밀번호 찾기 모달 */}
      {showFindPwModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[320px] space-y-4">
            <h3 className="text-xl font-semibold text-center">비밀번호 찾기</h3>
            <input
              ref={findPwUserIdRef}
              type="text"
              placeholder="아이디(이메일 또는 전화번호)"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
              onClick={handleFindPw}
            >
              찾기
            </button>
            <button
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={() => setShowFindPwModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 토스트 메시지 */}
      {toastMessage && (
        <div className="fixed top-20 left-0 right-0 mx-auto w-max bg-black/80 text-white px-4 py-3 rounded-lg z-50 animate-fadeIn">
          <div className="flex items-center gap-2">
            <i className="ri-information-line text-lg" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
