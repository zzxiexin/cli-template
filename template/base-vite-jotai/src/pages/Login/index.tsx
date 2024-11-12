import { useEffect, useState } from 'react';
import userInfo from '@store/index';
import { useAtom } from 'jotai';

const Login = () => {
  const [tmp, setTmp] = useState('');
  const [userinfo, setUserInfo] = useAtom(userInfo);
  // 初始化时，取本地数据
  useEffect(() => {
    if (!userinfo?.name) {
      const { name } = JSON.parse(localStorage.getItem('user_info') || '{}');
      name && setUserInfo?.({ name });
    }
  }, []);

  // 更新用户信息
  const updateInfo = (userInfo: { name: string }) => {
    setUserInfo?.(userInfo);
    localStorage.setItem('user_info', JSON.stringify(userInfo));
  };
  return (
    <div>
      {userinfo?.name ? (
        `welcome ${userinfo?.name}`
      ) : (
        <>
          <input
            onChange={(e) => {
              setTmp(e?.target?.value);
            }}
          />
          annymous, please login<button onClick={() => updateInfo({ name: tmp })}>点击登陆</button>
        </>
      )}
    </div>
  );
};

export default Login;
