import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import {
  setSelectedGroup,
  setSelectedSubgroup,
  setLength,
  setResult,
} from "./store/appSlice";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 500px;
  border: 3px double #ccc;
  border-radius: 30px;
  padding: 20px;
`;

const StyledFormControl = styled(FormControl)`
  width: 100%;
`;

const StyledSelect = styled(Select)`
  width: 100%;
`;

const App = () => {
  const data = useSelector((state) => state.app.data);
  const selectedGroup = useSelector((state) => state.app.selectedGroup);
  const selectedSubgroup = useSelector((state) => state.app.selectedSubgroup);
  const length = useSelector((state) => state.app.length);
  const result = useSelector((state) => state.app.result);
  const [selectedSubgroupValue, setSelectedSubgroupValue] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleGroupChange = (e) => {
    const group = e.target.value;
    dispatch(setSelectedGroup(group));
    dispatch(setSelectedSubgroup(""));
    const isValidGroup = group in data;
    dispatch(setSelectedGroup(isValidGroup ? group : {}));
  };

  const handleSubgroupChange = (e) => {
    const subgroup = e.target.value;
    setSelectedSubgroupValue(subgroup);
    dispatch(setSelectedSubgroup(data[selectedGroup][subgroup]));
  };

  const inputChangeHandler = (e) => {
    // Валидация ввода: оставляем только цифры и точку
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");
    dispatch(setLength(sanitizedValue));
  };

  const calculateWeight = () => {
    try {
      const weightPerKm = selectedSubgroup[0]?.value;
      if (!weightPerKm) {
        throw new Error("Свойство 'Расчетная масса (вес)' не найдено.");
      }
      const totalWeight = parseFloat(length) * weightPerKm;
      dispatch(setResult(`${totalWeight.toFixed(1)} кг`));
      setError(""); // Сброс ошибки
    } catch (error) {
      setError("Произошла ошибка при расчете массы."); 
      console.error(error); 
    }
  };

  const groupOptions = Object.keys(data).map((group) => (
    <MenuItem key={group} value={group}>
      {group}
    </MenuItem>
  ));

  const subgroupOptions = selectedGroup
    ? Object.keys(data[selectedGroup]).map((subgroup) => {
        const trimmedSubgroup = subgroup.replace(
          `${selectedGroup} `,
          ""
        );
        return (
          <MenuItem key={subgroup} value={subgroup}>
            {trimmedSubgroup}
          </MenuItem>
        );
      })
    : [];

  return (
    <Wrapper>
      <Container>
        <Typography variant="h4" gutterBottom>
          Калькулятор массы кабеля
        </Typography>

        <StyledFormControl fullWidth variant="filled">
          <InputLabel id="group-label">Группа марка-размера:</InputLabel>
          <StyledSelect
            labelId="group-label"
            id="group-select"
            value={selectedGroup}
            onChange={handleGroupChange}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: "300px",
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="">
              <em>Выберите группу</em>
            </MenuItem>
            {groupOptions}
          </StyledSelect>
        </StyledFormControl>
        <StyledFormControl fullWidth variant="filled">
          <InputLabel id="subgroup-label">Подгруппа марка-размера:</InputLabel>
          <StyledSelect
            labelId="subgroup-label"
            id="subgroup-select"
            value={selectedSubgroupValue}
            onChange={handleSubgroupChange}
            disabled={!selectedGroup}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: "220px",
                  overflowY: "auto",
                },
              },
            }}
          >
            <MenuItem value="">
              <em>Выберите подгруппу</em>
            </MenuItem>
            {subgroupOptions}
          </StyledSelect>
        </StyledFormControl>

        <TextField
          fullWidth
          id="length-input"
          label="Длина кабеля (км)"
          variant="outlined"
          value={length}
          onChange={inputChangeHandler}
          inputProps={{ inputMode: "numeric" }} // Указываем ввод числовых значений
        />

        <Button variant="contained" color="primary" onClick={calculateWeight}>
          Рассчитать
        </Button>
        <div style={{ width: "100%" }}>
          <Typography variant="h6">
            Результат: <span>{result}</span>
          </Typography>
        </div>
        {error && (
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        )}
      </Container>
    </Wrapper>
  );
};

export default App;
