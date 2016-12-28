(function () {
  'use strict';

  angular
    .module('about')
    .controller('aboutCtrl', aboutCtrl);

  function aboutCtrl() {
    var vm = this;

    vm.employees = [{
      'name':        'Matt Silverman',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/matt.jpg',
      'jobTitle':    'Managing Partner',
      'description': 'I ate at Buredo today!',
      'twitter':     '',
      'linkedin':    'https://www.linkedin.com/in/mattsilv'
    }, {
      'name':        'Daniel Zadoff',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/danny.jpg',
      'jobTitle':    'Managing Partner',
      'description': 'I also ate at Buredo today!',
      'twitter':     '',
      'linkedin':    'https://www.linkedin.com/in/dannyzadoff'
    }, {
      'name':        'Danielle Starin, MS, RD',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/danielle.png',
      'jobTitle':    'Director of Nutrition',
      'description': 'I also ate at Buredo today!',
      'twitter':     '',
      'linkedin':    'https://www.linkedin.com/in/daniellecolley'
    }, {
      'name':        'Paige Einstein, RD',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/paige.jpg',
      'jobTitle':    'Manager, Data Quality',
      'description': 'I also ate at Buredo today!',
      'twitter':     ''
    }, {
      'name':        'Samantha Hatton',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/sam.jpg',
      'jobTitle':    'Operations Analyst',
      'description': 'I also ate at Buredo today!',
      'linkedin':    'https://www.linkedin.com/in/samanthahatton',
      'twitter':     ''
    }, {
      'name':        'Yurko Fedoriv',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/yurko.jpg',
      'jobTitle':    'Platform Engineer',
      'description': 'I also ate at Buredo today!',
      'github':      'https://github.com/Yurko-Fedoriv',
      'linkedin':    'https://ua.linkedin.com/in/yuriifedoriv'
    }, {
      'name':        'Owen Diehl',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/owen.png',
      'image2':      'https://s3.amazonaws.com/cdn4-nutritionix/images/owen2.jpg',
      'jobTitle':    'Platform Engineer',
      'description': 'I also ate at Buredo today!',
      'twitter':     '',
      'github':      'https://github.com/owen-d'
    }, {
      'name':        'Leo Joseph Gajitos',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/leo.jpg',
      'jobTitle':    'Platform Engineer',
      'description': 'I also ate at Buredo today!',
      'github':      'https://github.com/majin22',
      'linkedin':    'https://ph.linkedin.com/in/leejay22'
    }, {
      'name':        'Rommel Malang',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/rommel.jpg',
      'jobTitle':    'Front-End Engineer',
      'description': 'I also ate at Buredo today!',
      'twitter':     ''
    }, {
      'name':        'Varun Gupta',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/varun.jpg',
      'jobTitle':    'Platform Engineer',
      'description': 'im pretty cool',
      'twitter':     '',
      'github':      'https://github.com/vgupta16',
      'linkedin':    'https://www.linkedin.com/in/vgupta16'
    }, {
      'name':        'Doug Phung',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/doug.jpg',
      'jobTitle':    'Platform Engineer',
      'description': 'im pretty cool',
      'twitter':     '',
      'github':      'https://github.com/floofydoug'
    }, {
      'name':        'Roman Doroschevici',
      'image':       'https://s3.amazonaws.com/cdn4-nutritionix/images/roman.jpg',
      'jobTitle':    'System Administrator',
      'description': '',
      'twitter':     ''
    }];

    vm.founders = vm.employees.splice(0, 2);
    vm.employees = vm.founders.concat(_.shuffle(vm.employees));
  }
})();
