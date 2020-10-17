export interface City {
  label: string;
  value: string;
}

export interface Country {
  label: string;
  value: string;
  cities: City[];
}

export const countries: Country[] = [
  {
    label: 'Bangladesh',
    value: 'Bangladesh',
    cities: [
      { label: 'Dhaka', value: 'Dhaka' },
      { label: 'Chittagong', value: 'Chittagong' },
      { label: 'Mymenshing', value: 'Mymenshing' },
      { label: 'Rajshahi', value: 'Rajshahi' }
    ]
  },
  {
    label: 'India',
    value: 'India',
    cities: [
      { label: 'Delhi', value: 'Delhi' },
      { label: 'Kolkata', value: 'Kolkata' },
      { label: 'Mumbai', value: 'Mumbai' },
      { label: 'Hydrabed', value: 'Hydrabed' }
    ]
  }
];
