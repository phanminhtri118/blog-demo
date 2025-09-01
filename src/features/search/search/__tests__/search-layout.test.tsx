import { render, screen } from '@testing-library/react';
import { SearchLayout } from '../search-layout';

describe('SearchLayout component', () => {
  it('should render the filters and results children', () => {
    const FiltersComponent = () => <div>Filters Section</div>;
    const ResultsComponent = () => <div>Results Section</div>;

    render(
      <SearchLayout
        filters={<FiltersComponent />}
        results={<ResultsComponent />}
      />
    );

    expect(screen.getByText('Filters Section')).toBeInTheDocument();
    expect(screen.getByText('Results Section')).toBeInTheDocument();
  });
});
