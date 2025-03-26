import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CssBaseline from "@mui/material/CssBaseline";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import SendIcon from "@mui/icons-material/Send";
import GroupIcon from '@mui/icons-material/Group';
import GroupAdd from "@mui/icons-material/GroupAdd";
import GroupRemove from "@mui/icons-material/GroupRemove";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SyncIcon from '@mui/icons-material/Sync';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SubjectIcon from '@mui/icons-material/Subject';
import PersonAdd from '@mui/icons-material/PersonAdd';
import PersonRemove from '@mui/icons-material/PersonRemove';
import Search from '@mui/icons-material/Search';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Check from '@mui/icons-material/Check';
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Pagination from '@mui/material/Pagination';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Switch from '@mui/material/Switch';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { TablePagination } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";

// Skapa ett tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#DC2E34",
    },
    secondary: {
      main: "#000000",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export {
  Box,
  Modal,
  CircularProgress,
  IconButton,
  Button,
  Input,
  FilledInput,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormHelperText,
  FormControl,
  FormControlLabel,
  TextField,
  Visibility,
  VisibilityOff,
  theme,
  ThemeProvider,
  Dialog,
  DialogActions,
  DialogContent,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  HomeIcon,
  PeopleIcon,
  MailIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  LogoutIcon,
  Stack,
  Divider,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Pagination,
  Checkbox,
  Autocomplete,
  CheckBoxOutlineBlankIcon,
  CheckBoxIcon,
  Chip,
  TableSortLabel,
  SendIcon,
  GroupIcon,
  GroupAdd,
  GroupRemove,
  DownloadIcon,
  GroupAddIcon,
  SyncIcon,
  SaveIcon,
  DeleteIcon,
  CloseIcon,
  SubjectIcon,
  PersonAdd,
  PersonRemove,
  Search,
  Tab,
  Tabs,
  Check,
  Avatar,
  Badge,
  styled,
  Switch,
  ArrowDropUpIcon,
  ArrowDropDownIcon,
};
