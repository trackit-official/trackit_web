"use client";

const Form = () => {
	return (
		<form action="#" className="relative">
			<input
				type="email"
				placeholder="Enter your email"
				className="w-full rounded-full border border-stroke px-6 py-3 shadow-solid-5 focus:border-primary focus:outline-none dark:border-strokedark dark:bg-black dark:shadow-none dark:focus:border-primary font-satoshi"
			/>
			<button
				type="submit"
				className="absolute right-0 rounded-r-full bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark transition font-satoshi"
			>
				Subscribe
			</button>
		</form>
	);
};

export default Form;
