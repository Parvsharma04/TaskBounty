const ImageCarousel = () => {
  return (
    <section className="bg-black text-white py-8">
      <h2 className="text-center text-2xl mb-2 font-bold leading-8">
        Our Clients
      </h2>
      <p className="text-center text-lg font-extralight leading-8 ">
        We are trusted by the world’s most innovative teams
      </p>

      <div className="logos group relative overflow-hidden whitespace-nowrap py-10 [mask-image:_linear-gradient(to_right,_transparent_0,_white_128px,white_calc(100%-128px),_transparent_100%)]">
        <div className="animate-slide-left group-hover:pause-animation inline-block w-max">
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg"
            alt="Transistor"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg"
            alt="Reform"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg"
            alt="Tuple"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg"
            alt="SavvyCal"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg"
            alt="SavvyCal"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/laravel-logo-white.svg"
            alt="SavvyCal"
          />
        </div>

        <div className="animate-slide-left group-hover:pause-animation inline-block w-max">
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg"
            alt="Transistor"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-white.svg"
            alt="Reform"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg"
            alt="Tuple"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg"
            alt="SavvyCal"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg"
            alt="SavvyCal"
          />
          <img
            className="mx-4 inline h-16"
            src="https://tailwindui.com/img/logos/158x48/laravel-logo-white.svg"
            alt="SavvyCal"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageCarousel;
