import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CommunityItemProps } from '../components/CommunityItem';
import endpoint from '../../../endpoint';

const useCommunityData = () => {
  const location = useLocation(); 
  const [community, setCommunity] = useState<CommunityItemProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        if (location.state && location.state.results) {
            const searchResults = location.state.results as CommunityItemProps[];
            setCommunity(searchResults);
        } else {
            try {
                const response = await axios.get<CommunityItemProps[]>(endpoint +`/dev/dictionary/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-processing-type1': 'community',
                        'x-processing-type2': 'get_community',
                    },
                });
                setCommunity(response.data);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
    };

    fetchData();
  }, [location.state]);

  return community;
};

export default useCommunityData;
