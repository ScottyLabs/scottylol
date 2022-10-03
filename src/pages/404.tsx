import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const LostPage: React.FC = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace('/help');
	});

	return null;
};

export default LostPage;
