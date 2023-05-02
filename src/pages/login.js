import { getProviders, signIn } from "next-auth/react";

export default function Login(props) {
  const { authProviders } = props;
  return (
    <div className="whitespace-pre min-h-screen bg-black text-white flex flex-col justify-center items-center gap-4">
      {/* {JSON.stringify(authProviders, null, 2)} */}
      <img className="w-52" alt="spotify-logo" src="/assets/spotify-logo.png" />
      {Object.values(authProviders).map(authProvider => (
        <div key={authProvider.id}>
          <button
            onClick={() => signIn(authProvider.id, { callbackUrl: '/' })}
            className="bg-[#2EBD59] text-white p-5 rounded-full"
          >Login with {authProvider.name}</button>
        </div>
      ))}
    </div>
  );
}

export const getServerSideProps = async () => {
  const authProviders = await getProviders();
  return {
    props: {
      authProviders
    }
  };
};