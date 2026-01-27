import React from 'react';

function WhyPartnerWithTryde() {
  const benefits = [
    {
      text: "REACH NEW CUSTOMERS",
      image: "https://plus.unsplash.com/premium_photo-1665203442280-1118daf3de38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDQ0fHx8ZW58MHx8fHx8",
      icon: (
        <svg
          className="w-14 h-14 md:w-20 md:h-20 text-white mb-5 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3 3h18M3 3v1.5M21 3v1.5m-18 0v18m18-18v18m-9-1.5V15m-6 3.75h6m-6-3.75h6"
          />
        </svg>
      ),
    },
    {
      text: "BOOST YOUR ORDER VOLUME",
      image: "https://images.unsplash.com/photo-1728044849280-10a1a75cff83?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: (
        <svg
          className="w-14 h-14 md:w-20 md:h-20 text-white mb-5 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
          />
        </svg>
      ),
    },
    {
      text: "DRIVE MORE SALES",
      image: "https://media.istockphoto.com/id/2190277687/photo/smiling-deliveryman-riding-a-red-scooter-against-a-bright-yellow-background-showcasing-urban.jpg?s=612x612&w=0&k=20&c=UCS8q5eWsbaNoQnVHbN116gwu8JxE8V1iwfi_7Hw_D0=",
      icon: (
        <svg
          className="w-14 h-14 md:w-20 md:h-20 text-white mb-5 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      text: "INCREASE CUSTOMER SATISFACTION",
      image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D",
      icon: (
        <svg
          className="w-14 h-14 md:w-20 md:h-20 text-white mb-5 drop-shadow-md"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Poppins font import - ye line index.html ke <head> mein daal dena ya CSS file mein @import kar lena */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet"> */}

      <div className="py-16 md:py-24 bg-white font-['Poppins']">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 mb-12 md:mb-16">
            Why partner with <span className="text-[#FF5252]">Tryde</span>?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {benefits.map((item, index) => (
              <div
                key={index}
                className={`
                  group relative aspect-[4/5] rounded-lg overflow-hidden shadow-md 
                  hover:shadow-xl transition-all duration-500
                  opacity-0 translate-y-8
                  animate-fade-in-up
                `}
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.text}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                {/* Icon + Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-5">
                  {item.icon}
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-center leading-tight drop-shadow-2xl tracking-wide">
                    {item.text}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animation Keyframes */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(32px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.9s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}

export default WhyPartnerWithTryde;