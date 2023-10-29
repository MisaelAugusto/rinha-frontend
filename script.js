// EMPTY JSON CONTAINER WHEN UPLOADING OTHER JSON
// RENDER ARRAY
// STYLE BASED ON TYPES
// STYLE JSON CONTAINER
// STYLE PROPS HIERARCHY
// IMPLEMENT PAGINATIO
// ACCESSIBILITY

const HEADER_OBJECT_ELEMENT = document.createElement('header');
HEADER_OBJECT_ELEMENT.textContent = '{';

const FOOTER_OBJECT_ELEMENT = document.createElement('footer');
FOOTER_OBJECT_ELEMENT.textContent = '}';

const jsonContainerElement =  document.createElement('div');

const fileNameElement = document.getElementById('file-name');

const getValueElement = (value) => {
  const propertyValuesValueElement = document.createElement('span');
  propertyValuesValueElement.classList.add(typeof value);
  
  let formattedValue = value;
  
  if (typeof value === 'string') {
    formattedValue = `"${value}"`
  }
  
  propertyValuesValueElement.textContent = formattedValue;

  return propertyValuesValueElement;
};

const getChildProps = (prop, parentElement) => {
  const childPropsElement = document.createElement('div');
  childPropsElement.classList.add('indentation');

  Object.entries(prop).forEach(([key, value]) => {
    const childPropKeyElement = document.createElement('p');
    childPropKeyElement.textContent = `${key}: `;
    childPropKeyElement.tabIndex = '0';

    if (typeof value === 'object') {
      renderProp(key, value, parentElement);
    } else {
      const childPropValueElement = getValueElement(value);
      
      childPropKeyElement.appendChild(childPropValueElement);
      
      childPropsElement.append(childPropKeyElement);
    }
  })

  return childPropsElement;
};

const renderProp = (key, value, parentElement) => {
  const propertyDiv = document.createElement('div');
  propertyDiv.classList.add('indentation');

  const propertyHeader = document.createElement('header');
  propertyHeader.textContent = `${key}: `;
  propertyHeader.tabIndex = '0';

  propertyDiv.appendChild(propertyHeader);

  if (typeof value === 'object') {
    const isArray = Array.isArray(value);

    const openBracket = isArray ? '[' : '{';
    propertyHeader.textContent += openBracket;
    
    const childPropsElement = getChildProps(value, propertyDiv);
    
    propertyDiv.appendChild(childPropsElement);
    
    const closeBracket = isArray ? ']' : '}';
    const footerElement = FOOTER_OBJECT_ELEMENT.cloneNode(true);
    footerElement.textContent = closeBracket;

    propertyDiv.appendChild(footerElement);
  } else {
    const childPropValueElement = getValueElement(value);
      
    propertyHeader.appendChild(childPropValueElement);
  }

  parentElement.appendChild(propertyDiv);
};

const renderJson = (file, object) => {
  fileNameElement.textContent = file.name;

  jsonContainerElement.appendChild(HEADER_OBJECT_ELEMENT);

  Object.entries(object).forEach(([key, value])=> {
    renderProp(key, value, jsonContainerElement);
  });

  const footerElement = FOOTER_OBJECT_ELEMENT.cloneNode(true);
  jsonContainerElement.appendChild(footerElement);

  const [mainElement] = document.getElementsByTagName('main');
  mainElement.appendChild(jsonContainerElement);
};

const jsonInput = document.getElementById('json-input');
jsonInput.onchange = (e) => {
  const file = e.target.files[0];

  if (file) {
    const reader = new FileReader();

    const errorMessageElement = document.getElementById('error-message');

    reader.onload = () => {
      try {
        const object = JSON.parse(reader.result);

        renderJson(file, object);

        errorMessageElement.hidden = true;
      } catch {
        errorMessageElement.removeAttribute('hidden');
        fileNameElement.textContent = '';
      }
    };
    
    reader.readAsText(file);
  }
}