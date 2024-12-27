import { useEffect, useState } from 'react';
import { Loader } from '../components/Loader';
import { Person } from '../types';
import { getPeople } from '../api';
import { PeopleTable } from '../components/PeopleTable';

export const PeoplePage = () => {
  const [peoples, setPeoples] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadPeople = () => {
    setIsLoading(true);
    setError('');

    getPeople()
      .then(res => {
        const peopleWithParents = res.map(person => {
          const father = res.find(parent => parent.name === person.fatherName);
          const mother = res.find(parent => parent.name === person.motherName);

          return { ...person, father, mother };
        });

        setPeoples(peopleWithParents);
      })
      .catch(() => setError('Unable to load data'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPeople();
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>
      <div className="box table-container">
        {isLoading && !error && <Loader />}

        {error && (
          <p data-cy="peopleLoadingError" className="has-text-danger">
            {error}
          </p>
        )}

        {!peoples.length && !error && !isLoading && (
          <p data-cy="noPeopleMessage">There are no people on the server</p>
        )}
        {!isLoading && !!peoples.length && <PeopleTable people={peoples} />}
      </div>
    </>
  );
};
