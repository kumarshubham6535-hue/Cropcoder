export interface StateOption {
  code: string;
  nameEn: string;
  nameHi: string;
  districts: string[];
}

export const INDIAN_STATES_AND_UT: StateOption[] = [
  {
    code: 'AP',
    nameEn: 'Andhra Pradesh',
    nameHi: 'आंध्र प्रदेश',
    districts: ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Nellore', 'Tirupati']
  },
  {
    code: 'AR',
    nameEn: 'Arunachal Pradesh',
    nameHi: 'अरुणाचल प्रदेश',
    districts: ['Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Papum Pare', 'Tawang', 'Tirap', 'Upper Subansiri', 'West Kameng', 'West Siang']
  },
  {
    code: 'AS',
    nameEn: 'Assam',
    nameHi: 'असम',
    districts: ['Baksa', 'Barpeta', 'Cachar', 'Darrang', 'Dhubri', 'Dibrugarh', 'Goalpara', 'Golaghat', 'Jorhat', 'Kamrup', 'Karbi Anglong', 'Karimganj', 'Lakhimpur', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'Tinsukia']
  },
  {
    code: 'BR',
    nameEn: 'Bihar',
    nameHi: 'बिहार',
    districts: ['Araria', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Katihar', 'Khagaria', 'Madhubani', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sitamarhi', 'Siwan', 'Vaishali', 'West Champaran', 'East Champaran']
  },
  {
    code: 'CG',
    nameEn: 'Chhattisgarh',
    nameHi: 'छत्तीसगढ़',
    districts: ['Balod', 'Bastar', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Janjgir-Champa', 'Kanker', 'Korba', 'Mahasamund', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja']
  },
  {
    code: 'GA',
    nameEn: 'Goa',
    nameHi: 'गोवा',
    districts: ['North Goa', 'South Goa']
  },
  {
    code: 'GJ',
    nameEn: 'Gujarat',
    nameHi: 'गुजरात',
    districts: ['Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Dahod', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mehsana', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Vadodara', 'Valsad']
  },
  {
    code: 'HR',
    nameEn: 'Haryana',
    nameHi: 'हरियाणा',
    districts: ['Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar']
  },
  {
    code: 'HP',
    nameEn: 'Himachal Pradesh',
    nameHi: 'हिमाचल प्रदेश',
    districts: ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una']
  },
  {
    code: 'JH',
    nameEn: 'Jharkhand',
    nameHi: 'झारखंड',
    districts: ['Bokaro', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'West Singhbhum']
  },
  {
    code: 'KA',
    nameEn: 'Karnataka',
    nameHi: 'कर्नाटक',
    districts: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir']
  },
  {
    code: 'KL',
    nameEn: 'Kerala',
    nameHi: 'केरल',
    districts: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad']
  },
  {
    code: 'MP',
    nameEn: 'Madhya Pradesh',
    nameHi: 'मध्य प्रदेश',
    districts: ['Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha']
  },
  {
    code: 'MH',
    nameEn: 'Maharashtra',
    nameHi: 'महाराष्ट्र',
    districts: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhaji Nagar)', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad (Dharashiv)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal']
  },
  {
    code: 'MN',
    nameEn: 'Manipur',
    nameHi: 'मणिपुर',
    districts: ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Senapati', 'Tamenglong', 'Thoubal', 'Ukhrul']
  },
  {
    code: 'ML',
    nameEn: 'Meghalaya',
    nameHi: 'मेघालय',
    districts: ['East Garo Hills', 'East Khasi Hills', 'Jaintia Hills', 'Ri Bhoi', 'South Garo Hills', 'West Garo Hills', 'West Khasi Hills']
  },
  {
    code: 'MZ',
    nameEn: 'Mizoram',
    nameHi: 'मिज़ोरम',
    districts: ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip']
  },
  {
    code: 'NL',
    nameEn: 'Nagaland',
    nameHi: 'नागालैंड',
    districts: ['Dimapur', 'Kohima', 'Mokokchung', 'Mon', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto']
  },
  {
    code: 'OD',
    nameEn: 'Odisha',
    nameHi: 'ओडिशा',
    districts: ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Ganjam', 'Jharsuguda', 'Kalahandi', 'Kendrapara', 'Keonjhar', 'Khordha', 'Koraput', 'Mayurbhanj', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh']
  },
  {
    code: 'PB',
    nameEn: 'Punjab',
    nameHi: 'पंजाब',
    districts: ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar (Mohali)', 'SBS Nagar', 'Tarn Taran']
  },
  {
    code: 'RJ',
    nameEn: 'Rajasthan',
    nameHi: 'राजस्थान',
    districts: ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur']
  },
  {
    code: 'SK',
    nameEn: 'Sikkim',
    nameHi: 'सिक्किम',
    districts: ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim']
  },
  {
    code: 'TN',
    nameEn: 'Tamil Nadu',
    nameHi: 'तमिलनाडु',
    districts: ['Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar']
  },
  {
    code: 'TS',
    nameEn: 'Telangana',
    nameHi: 'तेलंगाना',
    districts: ['Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Nalgonda', 'Nizamabad', 'Peddapalli', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Warangal', 'Yadadri Bhuvanagiri']
  },
  {
    code: 'TR',
    nameEn: 'Tripura',
    nameHi: 'त्रिपुरा',
    districts: ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura']
  },
  {
    code: 'UP',
    nameEn: 'Uttar Pradesh',
    nameHi: 'उत्तर प्रदेश',
    districts: ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi']
  },
  {
    code: 'UK',
    nameEn: 'Uttarakhand',
    nameHi: 'उत्तराखंड',
    districts: ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi']
  },
  {
    code: 'WB',
    nameEn: 'West Bengal',
    nameHi: 'पश्चिम बंगाल',
    districts: ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Pargano', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Pargano', 'Uttar Dinajpur']
  },
  // Union Territories
  {
    code: 'AN',
    nameEn: 'Andaman & Nicobar Islands (UT)',
    nameHi: 'अंडमान और निकोबार द्वीप समूह',
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman']
  },
  {
    code: 'CH',
    nameEn: 'Chandigarh (UT)',
    nameHi: 'चंडीगढ़',
    districts: ['Chandigarh']
  },
  {
    code: 'DN',
    nameEn: 'Dadra and Nagar Haveli & Daman and Diu (UT)',
    nameHi: 'दादरा एवं नगर हवेली और दमन एवं दीव',
    districts: ['Dadra & Nagar Haveli', 'Daman', 'Diu']
  },
  {
    code: 'DL',
    nameEn: 'Delhi (NCT)',
    nameHi: 'दिल्ली',
    districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi']
  },
  {
    code: 'JK',
    nameEn: 'Jammu & Kashmir (UT)',
    nameHi: 'जम्मू और कश्मीर',
    districts: ['Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu', 'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur']
  },
  {
    code: 'LA',
    nameEn: 'Ladakh (UT)',
    nameHi: 'लद्दाख',
    districts: ['Kargil', 'Leh']
  },
  {
    code: 'LD',
    nameEn: 'Lakshadweep (UT)',
    nameHi: 'लक्षद्वीप',
    districts: ['Lakshadweep']
  },
  {
    code: 'PY',
    nameEn: 'Puducherry (UT)',
    nameHi: 'पुदुचेरी',
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
  }
];
